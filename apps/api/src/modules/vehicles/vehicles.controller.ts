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
    const cId = parseInt(companyId);
    const custId = parseInt(customerId);

    if (isNaN(cId) || isNaN(custId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = CreateVehicleSchema.parse(body);
      return this.vehiclesService.create(cId, custId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Param('companyId') companyId: string, @Param('customerId') customerId: string) {
    const cId = parseInt(companyId);
    const custId = parseInt(customerId);

    if (isNaN(cId) || isNaN(custId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.vehiclesService.findAll(cId, custId);
  }

  @Get(':id')
  async findById(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Param('id') id: string,
  ) {
    const cId = parseInt(companyId);
    const custId = parseInt(customerId);
    const vehicleId = parseInt(id);

    if (isNaN(cId) || isNaN(custId) || isNaN(vehicleId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.vehiclesService.findById(cId, custId, vehicleId);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('customerId') customerId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const custId = parseInt(customerId);
    const vehicleId = parseInt(id);

    if (isNaN(cId) || isNaN(custId) || isNaN(vehicleId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateVehicleSchema.parse(body);
      return this.vehiclesService.update(cId, custId, vehicleId, data);
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
    const cId = parseInt(companyId);
    const custId = parseInt(customerId);
    const vehicleId = parseInt(id);

    if (isNaN(cId) || isNaN(custId) || isNaN(vehicleId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.vehiclesService.delete(cId, custId, vehicleId);
  }
}
