import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerSchema, UpdateCustomerSchema } from './dto';

@Controller('companies/:companyId/customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(@Param('companyId') companyId: string, @Body() body: unknown) {
    try {
      const data = CreateCustomerSchema.parse(body);
      return this.customersService.create(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.customersService.findAll(companyId, pageNum, limitNum);
  }

  @Get('search')
  async search(@Param('companyId') companyId: string, @Query('q') query: string) {
    if (!query) throw new BadRequestException('Query obrigatória');

    return this.customersService.search(companyId, query);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.customersService.findById(companyId, id);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateCustomerSchema.parse(body);
      return this.customersService.update(companyId, id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.customersService.delete(companyId, id);
  }
}
