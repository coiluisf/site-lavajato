import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, customerId: string, data: CreateVehicleDto) {
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
        make: data.make,
        model: data.model,
        color: data.color,
        year: data.year,
        companyId,
        customerId,
        categoryId: data.categoryId,
      },
    });
  }

  async findAll(companyId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.vehicle.findMany({
      where: { customerId, companyId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: string, customerId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        companyId,
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

  async update(companyId: string, customerId: string, id: string, data: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        companyId,
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
        make: data.make ?? vehicle.make,
        model: data.model ?? vehicle.model,
        color: data.color ?? vehicle.color,
        year: data.year ?? vehicle.year,
        categoryId: data.categoryId ?? vehicle.categoryId,
      },
    });
  }

  async delete(companyId: string, customerId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        customerId,
        companyId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const hasOrders = await this.prisma.serviceOrder.count({
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
