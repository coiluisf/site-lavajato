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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleSchema, UpdateVehicleSchema } from './dto';

@Controller('companies/:companyId/customers/:customerId/vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  async create(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Body() body: unknown,
  ) {
    try {
      const data = CreateVehicleSchema.parse(body);
      return this.vehiclesService.create(companyId, customerId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Param('companyId') companyId: string, @Param('customerId') customerId: string) {
    return this.vehiclesService.findAll(companyId, customerId);
  }

  @Get(':id')
  async findById(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Param('id') id: string,
  ) {
    return this.vehiclesService.findById(companyId, customerId, id);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateVehicleSchema.parse(body);
      return this.vehiclesService.update(companyId, customerId, id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Param('id') id: string,
  ) {
    return this.vehiclesService.delete(companyId, customerId, id);
  }
}
