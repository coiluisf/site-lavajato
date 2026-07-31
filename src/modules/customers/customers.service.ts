import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateCustomerDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.customer.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        city: data.city,
        state: data.state,
        status: 'ACTIVE',
        companyId,
      },
    });
  }

  async findAll(companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: { companyId },
        include: { vehicles: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where: { companyId } }),
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(companyId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
      include: {
        vehicles: {
          include: { category: true },
        },
        appointments: { take: 10 },
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }

  async update(companyId: string, id: string, data: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name ?? customer.name,
        cpf: data.cpf ?? customer.cpf,
        email: data.email ?? customer.email,
        phone: data.phone ?? customer.phone,
        whatsapp: data.whatsapp ?? customer.whatsapp,
        address: data.address ?? customer.address,
        city: data.city ?? customer.city,
        state: data.state ?? customer.state,
      },
    });
  }

  async delete(companyId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const hasOrders = await this.prisma.serviceOrder.count({
      where: { customerId: id },
    });

    if (hasOrders) {
      throw new BadRequestException('Não é possível deletar cliente com pedidos registrados');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async search(companyId: string, query: string) {
    return this.prisma.customer.findMany({
      where: {
        companyId,
        OR: [
          { name: { contains: query } },
          { cpf: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
        ],
      },
      include: { vehicles: true },
      take: 10,
    });
  }
}
