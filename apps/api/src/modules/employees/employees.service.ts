import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: CreateEmployeeDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const existingEmployee = await this.prisma.employee.findFirst({
      where: { email: data.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await argon2.hash(data.password);

    return this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: 'active',
        password: hashedPassword,
        companyId,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.employee.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: number, id: number) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        appointments: { take: 10 },
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(companyId: number, id: number, data: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    if (data.email && data.email !== employee.email) {
      const existingEmployee = await this.prisma.employee.findFirst({
        where: { email: data.email },
      });

      if (existingEmployee) {
        throw new ConflictException('Email já está em uso');
      }
    }

    const updateData: any = {
      name: data.name ?? employee.name,
      email: data.email ?? employee.email,
      phone: data.phone ?? employee.phone,
      role: data.role ?? employee.role,
      status: data.status ?? employee.status,
    };

    if (data.password) {
      updateData.password = await argon2.hash(data.password);
    }

    return this.prisma.employee.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });
  }

  async delete(companyId: number, id: number) {
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
