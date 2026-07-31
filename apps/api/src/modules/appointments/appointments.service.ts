import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateAppointmentDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: data.vehicleId, companyId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const service = await this.prisma.service.findFirst({
      where: { id: data.serviceId, companyId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const scheduledAt = new Date(data.scheduledAt);
    if (scheduledAt < new Date()) {
      throw new BadRequestException('Data do agendamento deve ser no futuro');
    }

    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        vehicleId: data.vehicleId,
        scheduledAt,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Já existe um agendamento para este veículo nesta data');
    }

    return this.prisma.appointment.create({
      data: {
        scheduledAt,
        notes: data.notes,
        status: 'SCHEDULED',
        vehicleId: data.vehicleId,
        serviceId: data.serviceId,
        companyId,
        customerId: vehicle.customerId,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
      },
    });
  }

  async findAll(companyId: string, filter?: { status?: string; date?: string }, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { companyId };

    if (filter?.status) {
      where.status = filter.status.toUpperCase();
    }

    if (filter?.date) {
      const startDate = new Date(filter.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.scheduledAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          vehicle: { include: { customer: true } },
          service: true,
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
      include: {
        vehicle: { include: { customer: true, category: true } },
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return appointment;
  }

  async update(companyId: string, id: string, data: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (data.scheduledAt) {
      const newDate = new Date(data.scheduledAt);
      if (newDate < new Date() && appointment.status !== 'COMPLETED') {
        throw new BadRequestException('Data deve ser no futuro');
      }

      if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
        throw new BadRequestException('Não é possível alterar agendamentos completos ou cancelados');
      }

      const conflict = await this.prisma.appointment.findFirst({
        where: {
          vehicleId: appointment.vehicleId,
          scheduledAt: newDate,
          id: { not: id },
          status: { notIn: ['CANCELLED', 'COMPLETED'] },
        },
      });

      if (conflict) {
        throw new ConflictException('Conflito com outro agendamento');
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        notes: data.notes ?? appointment.notes,
        status: data.status ?? appointment.status,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
      },
    });
  }

  async cancel(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Não é possível cancelar agendamentos completos');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async updateStatus(companyId: string, id: string, status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
      },
    });
  }

  async getTodayAppointments(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.appointment.findMany({
      where: {
        companyId,
        scheduledAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
