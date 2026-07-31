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
    try {
      const data = CreateServiceSchema.parse(body);
      return this.servicesService.create(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Param('companyId') companyId: string) {
    return this.servicesService.findAll(companyId);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.servicesService.findById(companyId, id);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateServiceSchema.parse(body);
      return this.servicesService.update(companyId, id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.servicesService.delete(companyId, id);
  }
}
