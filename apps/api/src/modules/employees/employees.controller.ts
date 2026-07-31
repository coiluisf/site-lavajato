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
import { EmployeesService } from './employees.service';
import { CreateEmployeeSchema, UpdateEmployeeSchema } from './dto';

@Controller('companies/:companyId/employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  async create(@Param('companyId') companyId: string, @Body() body: unknown) {
    try {
      const data = CreateEmployeeSchema.parse(body);
      return this.employeesService.create(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Param('companyId') companyId: string) {
    return this.employeesService.findAll(companyId);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.employeesService.findById(companyId, id);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateEmployeeSchema.parse(body);
      return this.employeesService.update(companyId, id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.employeesService.delete(companyId, id);
  }
}
