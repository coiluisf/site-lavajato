import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateOrderDto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: data.vehicleId, companyId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: vehicle.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (data.appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: { id: data.appointmentId, companyId },
      });

      if (!appointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }
    }

    const orderCount = await this.prisma.serviceOrder.count({
      where: { companyId },
    });
    const orderNumber = orderCount + 1;

    const totalPrice = new Prisma.Decimal(0);

    return this.prisma.serviceOrder.create({
      data: {
        orderNumber,
        status: 'DRAFT',
        vehicleId: data.vehicleId,
        customerId: vehicle.customerId,
        appointmentId: data.appointmentId || undefined,
        companyId,
        totalPrice,
      },
      include: {
        vehicle: { include: { customer: true } },
        appointment: true,
      },
    });
  }

  async findAll(companyId: string, status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { companyId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.serviceOrder.findMany({
        where,
        include: {
          vehicle: { include: { customer: true } },
          appointment: true,
          items: { include: { service: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.serviceOrder.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(companyId: string, id: string) {
    const order = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId },
      include: {
        vehicle: { include: { customer: true, category: true } },
        appointment: true,
        items: { include: { service: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(companyId: string, id: string, data: UpdateOrderStatusDto) {
    const order = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Não é possível alterar pedidos entregues ou cancelados');
    }

    return this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        vehicle: { include: { customer: true } },
        appointment: true,
        items: { include: { service: true } },
      },
    });
  }

  async cancel(companyId: string, id: string) {
    const order = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === 'DELIVERED') {
      throw new BadRequestException('Não é possível cancelar pedidos entregues');
    }

    return this.prisma.serviceOrder.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async getCompanyRevenue(companyId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.serviceOrder.findMany({
      where: {
        companyId,
        status: 'DELIVERED',
        createdAt: { gte: startDate },
      },
    });

    const totalRevenue = orders.reduce((sum: number, order: any) => {
      const price = typeof order.totalPrice === 'object' ? parseFloat(order.totalPrice.toString()) : Number(order.totalPrice);
      return sum + (price || 0);
    }, 0);

    return {
      totalRevenue,
      completedOrders: orders.length,
      period: `${days} dias`,
      startDate,
    };
  }
}
