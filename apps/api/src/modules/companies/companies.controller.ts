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
import { CreateCompanySchema, UpdateCompanySchema } from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: unknown, @CurrentUser() userId: string) {
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
    return this.companiesService.findById(id);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.companiesService.getStats(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: unknown) {
    try {
      const data = UpdateCompanySchema.parse(body);
      return this.companiesService.update(id, data);
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
    return this.companiesService.delete(id);
  }
}
