import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateEmployeeDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const existingEmployee = await this.prisma.employee.findFirst({
      where: { cpf: data.cpf, companyId },
    });

    if (existingEmployee) {
      throw new ConflictException('CPF já está em uso');
    }

    return this.prisma.employee.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: 'ACTIVE',
        hiredAt: new Date(),
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        salary: true,
        commissionPercentage: true,
        createdAt: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(companyId: string, id: string, data: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    const updateData: any = {
      name: data.name ?? employee.name,
      email: data.email ?? employee.email,
      phone: data.phone ?? employee.phone,
      role: data.role ?? employee.role,
      status: data.status ?? employee.status,
    };

    return this.prisma.employee.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });
  }

  async delete(companyId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
