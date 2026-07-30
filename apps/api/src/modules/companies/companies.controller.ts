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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanySchema, UpdateCompanySchema, CreateCompanyDto, UpdateCompanyDto } from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: unknown, @CurrentUser() userId: number) {
    try {
      const data = CreateCompanySchema.parse(body);
      return this.companiesService.create(data, userId);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.companiesService.findById(companyId);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.companiesService.getStats(companyId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: unknown) {
    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      throw new BadRequestException('ID inválido');
    }

    try {
      const data = UpdateCompanySchema.parse(body);
      return this.companiesService.update(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.companiesService.delete(companyId);
  }
}
