import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: CreateCustomerDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { document: data.document },
    });

    if (existingCustomer) {
      throw new ConflictException('Cliente com este CPF/CNPJ já existe');
    }

    return this.prisma.customer.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        companyId,
      },
    });
  }

  async findAll(companyId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: { companyId },
        include: { vehicles: true, orders: { take: 3 } },
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

  async findById(companyId: number, id: number) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
      include: {
        vehicles: {
          include: { category: true },
        },
        orders: { take: 10 },
        appointments: { take: 10 },
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }

  async update(companyId: number, id: number, data: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (data.document && data.document !== customer.document) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { document: data.document },
      });

      if (existingCustomer) {
        throw new ConflictException('CPF/CNPJ já está em uso');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name ?? customer.name,
        document: data.document ?? customer.document,
        email: data.email ?? customer.email,
        phone: data.phone ?? customer.phone,
        address: data.address ?? customer.address,
        city: data.city ?? customer.city,
        state: data.state ?? customer.state,
        zipCode: data.zipCode ?? customer.zipCode,
      },
    });
  }

  async delete(companyId: number, id: number) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const hasOrders = await this.prisma.order.count({
      where: { customerId: id },
    });

    if (hasOrders) {
      throw new BadRequestException('Não é possível deletar cliente com pedidos registrados');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async search(companyId: number, query: string) {
    return this.prisma.customer.findMany({
      where: {
        companyId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { document: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      include: { vehicles: true },
      take: 10,
    });
  }
}
