import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: CreateServiceDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const existingService = await this.prisma.service.findFirst({
      where: { name: data.name, companyId },
    });

    if (existingService) {
      throw new ConflictException('Serviço com este nome já existe');
    }

    return this.prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        basePrice: data.basePrice,
        companyId,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.service.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: number, id: number) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId },
      include: {
        appointments: { take: 10 },
        orders: { take: 10 },
      },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async update(companyId: number, id: number, data: UpdateServiceDto) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (data.name && data.name !== service.name) {
      const existingService = await this.prisma.service.findFirst({
        where: { name: data.name, companyId },
      });

      if (existingService) {
        throw new ConflictException('Nome do serviço já existe');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        name: data.name ?? service.name,
        description: data.description ?? service.description,
        duration: data.duration ?? service.duration,
        basePrice: data.basePrice ?? service.basePrice,
      },
    });
  }

  async delete(companyId: number, id: number) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
