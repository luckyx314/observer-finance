import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentReminderService } from './payment-reminder.service';
import { CreatePaymentReminderDto } from './dto/create-payment-reminder.dto';
import { UpdatePaymentReminderDto } from './dto/update-payment-reminder.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentReminderController {
  constructor(private readonly paymentReminderService: PaymentReminderService) {}

  @Post()
  create(@Body() dto: CreatePaymentReminderDto, @Request() req) {
    return this.paymentReminderService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.paymentReminderService.findAllByUser(req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentReminderDto,
    @Request() req,
  ) {
    return this.paymentReminderService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.paymentReminderService.remove(id, req.user.userId);
  }
}
