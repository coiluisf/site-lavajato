import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, customerId: number, data: CreateVehicleDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const category = await this.prisma.vehicleCategory.findFirst({
      where: { id: data.categoryId, companyId },
    });

    if (!category) {
      throw new NotFoundException('Categoria de veículo não encontrada');
    }

    return this.prisma.vehicle.create({
      data: {
        plate: data.plate.toUpperCase(),
        brand: data.brand,
        model: data.model,
        color: data.color,
        year: data.year,
        customerId,
        categoryId: data.categoryId,
      },
    });
  }

  async findAll(companyId: number, customerId: number) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.vehicle.findMany({
      where: { customerId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: number, customerId: number, id: number) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        customer: { companyId },
      },
      include: {
        category: true,
        appointments: { take: 10 },
        orders: { take: 10 },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }

  async update(companyId: number, customerId: number, id: number, data: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        customer: { companyId },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    if (data.categoryId) {
      const category = await this.prisma.vehicleCategory.findFirst({
        where: { id: data.categoryId, companyId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        plate: data.plate ? data.plate.toUpperCase() : vehicle.plate,
        brand: data.brand ?? vehicle.brand,
        model: data.model ?? vehicle.model,
        color: data.color ?? vehicle.color,
        year: data.year ?? vehicle.year,
        categoryId: data.categoryId ?? vehicle.categoryId,
      },
    });
  }

  async delete(companyId: number, customerId: number, id: number) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        customer: { companyId },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const hasOrders = await this.prisma.order.count({
      where: { vehicleId: id },
    });

    if (hasOrders) {
      throw new BadRequestException('Não é possível deletar veículo com pedidos registrados');
    }

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
