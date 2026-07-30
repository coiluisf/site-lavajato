import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCompanyDto, userId: number) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { document: data.document },
    });

    if (existingCompany) {
      throw new ConflictException('Empresa com este CNPJ já existe');
    }

    return this.prisma.company.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        monthlyFee: data.monthlyFee,
        hostingFee: data.hostingFee,
        createdBy: userId,
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

  async findById(id: number) {
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

  async update(id: number, data: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (data.document && data.document !== company.document) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { document: data.document },
      });

      if (existingCompany) {
        throw new ConflictException('CNPJ já está em uso');
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        name: data.name ?? company.name,
        document: data.document ?? company.document,
        email: data.email ?? company.email,
        phone: data.phone ?? company.phone,
        address: data.address ?? company.address,
        city: data.city ?? company.city,
        state: data.state ?? company.state,
        zipCode: data.zipCode ?? company.zipCode,
        monthlyFee: data.monthlyFee ?? company.monthlyFee,
        hostingFee: data.hostingFee ?? company.hostingFee,
      },
    });
  }

  async delete(id: number) {
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

  async getStats(id: number) {
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
