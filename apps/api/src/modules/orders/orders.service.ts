import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: CreateOrderDto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: data.vehicleId, customer: { companyId } },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const service = await this.prisma.service.findFirst({
      where: { id: data.serviceId, companyId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const appointmentId = data.appointmentId ? parseInt(data.appointmentId) : null;
    if (appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: { id: appointmentId, companyId },
      });

      if (!appointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }
    }

    const totalPrice = service.basePrice * (data.quantity || 1);

    return this.prisma.order.create({
      data: {
        quantity: data.quantity || 1,
        totalPrice,
        status: 'pending',
        notes: data.notes,
        vehicleId: data.vehicleId,
        customerId: vehicle.customerId,
        serviceId: data.serviceId,
        appointmentId: appointmentId || undefined,
        companyId,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
        appointment: true,
      },
    });
  }

  async findAll(companyId: number, status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { companyId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          vehicle: { include: { customer: true } },
          service: true,
          appointment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
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

  async findById(companyId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, companyId },
      include: {
        vehicle: { include: { customer: true, category: true } },
        service: true,
        appointment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(companyId: number, id: number, data: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findFirst({
      where: { id, companyId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new BadRequestException('Não é possível alterar pedidos completos ou cancelados');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes ?? order.notes,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
        appointment: true,
      },
    });
  }

  async cancel(companyId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, companyId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === 'completed') {
      throw new BadRequestException('Não é possível cancelar pedidos completos');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async getCompanyRevenue(companyId: number, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
        status: 'completed',
        createdAt: { gte: startDate },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return {
      totalRevenue,
      completedOrders: orders.length,
      period: `${days} dias`,
      startDate,
    };
  }
}
