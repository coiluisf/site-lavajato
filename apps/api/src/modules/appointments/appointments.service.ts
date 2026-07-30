import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: CreateAppointmentDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: data.vehicleId, customer: { companyId } },
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

    const appointmentDateTime = new Date(data.appointmentDate);
    if (appointmentDateTime < new Date()) {
      throw new BadRequestException('Data do agendamento deve ser no futuro');
    }

    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        vehicleId: data.vehicleId,
        appointmentDate: appointmentDateTime,
        status: { notIn: ['cancelled', 'completed'] },
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Já existe um agendamento para este veículo nesta data');
    }

    return this.prisma.appointment.create({
      data: {
        appointmentDate: appointmentDateTime,
        notes: data.notes,
        status: 'scheduled',
        vehicleId: data.vehicleId,
        serviceId: data.serviceId,
        companyId,
        customerId: vehicle.customerId,
        employeeId: data.employeeId || undefined,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
        employee: true,
      },
    });
  }

  async findAll(companyId: number, filter?: { status?: string; date?: string }, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { companyId };

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.date) {
      const startDate = new Date(filter.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.appointmentDate = {
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
          employee: true,
        },
        orderBy: { appointmentDate: 'asc' },
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

  async findById(companyId: number, id: number) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
      include: {
        vehicle: { include: { customer: true, category: true } },
        service: true,
        employee: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return appointment;
  }

  async update(companyId: number, id: number, data: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (data.appointmentDate) {
      const newDate = new Date(data.appointmentDate);
      if (newDate < new Date() && appointment.status !== 'completed') {
        throw new BadRequestException('Data deve ser no futuro');
      }

      if (appointment.status === 'in_progress' || appointment.status === 'completed') {
        throw new BadRequestException('Não é possível alterar agendamentos em andamento ou completos');
      }

      const conflict = await this.prisma.appointment.findFirst({
        where: {
          vehicleId: appointment.vehicleId,
          appointmentDate: newDate,
          id: { not: id },
          status: { notIn: ['cancelled', 'completed'] },
        },
      });

      if (conflict) {
        throw new ConflictException('Conflito com outro agendamento');
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
        notes: data.notes ?? appointment.notes,
        status: data.status ?? appointment.status,
        employeeId: data.employeeId ?? appointment.employeeId,
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
        employee: true,
      },
    });
  }

  async cancel(companyId: number, id: number) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.status === 'completed') {
      throw new BadRequestException('Não é possível cancelar agendamentos completos');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async updateStatus(companyId: number, id: number, status: 'in_progress' | 'completed') {
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
        employee: true,
      },
    });
  }

  async getTodayAppointments(companyId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.appointment.findMany({
      where: {
        companyId,
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        vehicle: { include: { customer: true } },
        service: true,
        employee: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }
}
