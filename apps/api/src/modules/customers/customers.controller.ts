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
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    try {
      const data = CreateCustomerSchema.parse(body);
      return this.customersService.create(id, data);
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
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.customersService.findAll(id, pageNum, limitNum);
  }

  @Get('search')
  async search(@Param('companyId') companyId: string, @Query('q') query: string) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');
    if (!query) throw new BadRequestException('Query obrigatória');

    return this.customersService.search(id, query);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const customerId = parseInt(id);

    if (isNaN(cId) || isNaN(customerId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.customersService.findById(cId, customerId);
  }

  @Put(':id')
  async update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const customerId = parseInt(id);

    if (isNaN(cId) || isNaN(customerId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateCustomerSchema.parse(body);
      return this.customersService.update(cId, customerId, data);
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
    const customerId = parseInt(id);

    if (isNaN(cId) || isNaN(customerId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.customersService.delete(cId, customerId);
  }
}
