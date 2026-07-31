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
    try {
      const data = CreateOrderSchema.parse(body);
      return this.ordersService.create(companyId, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('revenue')
  async getRevenue(@Param('companyId') companyId: string, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.ordersService.getCompanyRevenue(companyId, daysNum);
  }

  @Get()
  async findAll(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.ordersService.findAll(companyId, status, pageNum, limitNum);
  }

  @Get(':id')
  async findById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.ordersService.findById(companyId, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    try {
      const data = UpdateOrderStatusSchema.parse(body);
      return this.ordersService.updateStatus(companyId, id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async cancel(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.ordersService.cancel(companyId, id);
  }
}
