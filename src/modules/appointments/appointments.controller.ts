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
    try {
      const data = CreateAppointmentSchema.parse(body);
      return this.appointmentsService.create(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('today')
  async getTodayAppointments(@Param('companyId') companyId: string) {
    return this.appointmentsService.getTodayAppointments(companyId);
  }

  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.appointmentsService.findAll(companyId, { status, date }, pageNum, limitNum);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.appointmentsService.findById(companyId, id);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateAppointmentSchema.parse(body);
      return this.appointmentsService.update(companyId, id, data);
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
    if (!['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    return this.appointmentsService.updateStatus(companyId, id, status as any);
  }

  @Delete(':id')
  async cancel(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.appointmentsService.cancel(companyId, id);
  }
}
