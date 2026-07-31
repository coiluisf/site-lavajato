import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateServiceDto) {
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
        durationMinutes: data.durationMinutes,
        isActive: true,
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.service.findMany({
      where: { companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: string, id: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId },
      include: {
        appointments: { take: 10 },
        prices: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async update(companyId: string, id: string, data: UpdateServiceDto) {
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
        durationMinutes: data.durationMinutes ?? service.durationMinutes,
      },
    });
  }

  async delete(companyId: string, id: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, companyId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
