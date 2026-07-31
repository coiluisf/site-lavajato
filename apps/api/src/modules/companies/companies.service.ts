import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCompanyDto, userId: string) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpjCpf: data.cnpjCpf },
    });

    if (existingCompany) {
      throw new ConflictException('Empresa com este CNPJ já existe');
    }

    return this.prisma.company.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        cnpjCpf: data.cnpjCpf,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        status: 'ACTIVE',
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        servicePrices: true,
        vehicleCategories: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        servicePrices: true,
        vehicleCategories: true,
        customers: { take: 5 },
        appointments: { take: 5 },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: string, data: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (data.cnpjCpf && data.cnpjCpf !== company.cnpjCpf) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { cnpjCpf: data.cnpjCpf },
      });

      if (existingCompany) {
        throw new ConflictException('CNPJ já está em uso');
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        name: data.name ?? company.name,
        displayName: data.displayName ?? company.displayName,
        cnpjCpf: data.cnpjCpf ?? company.cnpjCpf,
        email: data.email ?? company.email,
        phone: data.phone ?? company.phone,
        whatsapp: data.whatsapp ?? company.whatsapp,
        address: data.address ?? company.address,
      },
    });
  }

  async delete(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }

  async getStats(id: string) {
    const company = await this.findById(id);

    const [totalCustomers, totalAppointments, totalEmployees, totalVehicles] = await Promise.all([
      this.prisma.customer.count({ where: { companyId: id } }),
      this.prisma.appointment.count({ where: { companyId: id } }),
      this.prisma.employee.count({ where: { companyId: id } }),
      this.prisma.vehicle.count({ where: { companyId: id } }),
    ]);

    return {
      ...company,
      stats: {
        totalCustomers,
        totalAppointments,
        totalEmployees,
        totalVehicles,
      },
    };
  }
}
