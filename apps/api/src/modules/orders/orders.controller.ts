import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderSchema, UpdateOrderStatusSchema } from './dto';

@Controller('companies/:companyId/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Param('companyId') companyId: string, @Body() body: unknown) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    try {
      const data = CreateOrderSchema.parse(body);
      return this.ordersService.create(id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('revenue')
  async getRevenue(@Param('companyId') companyId: string, @Query('days') days?: string) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    const daysNum = days ? parseInt(days) : 30;
    return this.ordersService.getCompanyRevenue(id, daysNum);
  }

  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const id = parseInt(companyId);
    if (isNaN(id)) throw new BadRequestException('Company ID inválido');

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.ordersService.findAll(id, status, pageNum, limitNum);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const orderId = parseInt(id);

    if (isNaN(cId) || isNaN(orderId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.ordersService.findById(cId, orderId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const cId = parseInt(companyId);
    const orderId = parseInt(id);

    if (isNaN(cId) || isNaN(orderId)) {
      throw new BadRequestException('IDs inválidos');
    }

    try {
      const data = UpdateOrderStatusSchema.parse(body);
      return this.ordersService.updateStatus(cId, orderId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async cancel(@Param('companyId') companyId: string, @Param('id') id: string) {
    const cId = parseInt(companyId);
    const orderId = parseInt(id);

    if (isNaN(cId) || isNaN(orderId)) {
      throw new BadRequestException('IDs inválidos');
    }

    return this.ordersService.cancel(cId, orderId);
  }
}
