import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentSchema, UpdateAppointmentSchema } from './dto';

@Controller('companies/:companyId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Param('companyId') companyId: string, @Body() body: unknown) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    try {
      const data = CreateAppointmentSchema.parse(body);
      return this.appointmentsService.create(id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('today')
  async getTodayAppointments(@Param('companyId') companyId: string) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    return this.appointmentsService.getTodayAppointments(id);
  }

  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.appointmentsService.findAll(id, { status, date }, pageNum, limitNum);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const appointmentId = parseInt(id);

    if (isNaN(cId) || isNaN(appointmentId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.appointmentsService.findById(cId, appointmentId);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const appointmentId = parseInt(id);

    if (isNaN(cId) || isNaN(appointmentId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateAppointmentSchema.parse(body);
      return this.appointmentsService.update(cId, appointmentId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const cId = parseInt(companyId);
    const appointmentId = parseInt(id);

    if (isNaN(cId) || isNaN(appointmentId)) {
      throw new BadRequestException('IDs inválidos');
    }

    if (!['in_progress', 'completed'].includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    return this.appointmentsService.updateStatus(cId, appointmentId, status as any);
  }

  @Delete(':id')
  async cancel(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const appointmentId = parseInt(id);

    if (isNaN(cId) || isNaN(appointmentId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.appointmentsService.cancel(cId, appointmentId);
  }
}
