import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ServicesService } from './services.service';
import { CreateServiceSchema, UpdateServiceSchema } from './dto';

@Controller('companies/:companyId/services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  async create(@Param('companyId') companyId: string, @Body() body: unknown) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    try {
      const data = CreateServiceSchema.parse(body);
      return this.servicesService.create(id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Param('companyId') companyId: string) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    return this.servicesService.findAll(id);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const serviceId = parseInt(id);

    if (isNaN(cId) || isNaN(serviceId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.servicesService.findById(cId, serviceId);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const serviceId = parseInt(id);

    if (isNaN(cId) || isNaN(serviceId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateServiceSchema.parse(body);
      return this.servicesService.update(cId, serviceId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const serviceId = parseInt(id);

    if (isNaN(cId) || isNaN(serviceId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.servicesService.delete(cId, serviceId);
  }
}
