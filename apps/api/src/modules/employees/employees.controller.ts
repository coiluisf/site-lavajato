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
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    try {
      const data = CreateEmployeeSchema.parse(body);
      return this.employeesService.create(id, data);
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

    return this.employeesService.findAll(id);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const employeeId = parseInt(id);

    if (isNaN(cId) || isNaN(employeeId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.employeesService.findById(cId, employeeId);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const employeeId = parseInt(id);

    if (isNaN(cId) || isNaN(employeeId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateEmployeeSchema.parse(body);
      return this.employeesService.update(cId, employeeId, data);
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
    const employeeId = parseInt(id);

    if (isNaN(cId) || isNaN(employeeId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.employeesService.delete(cId, employeeId);
  }
}
