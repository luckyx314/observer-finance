import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionService.create(createTransactionDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('type') type?: string, @Query('category') category?: string) {
    if (type) {
      return this.transactionService.findByType(type, req.user.userId);
    }
    if (category) {
      return this.transactionService.findByCategory(category, req.user.userId);
    }
    return this.transactionService.findAll(req.user.userId);
  }

  @Get('stats/total')
  async getTotalByType(@Request() req, @Query('type') type: string) {
    return {
      type,
      total: await this.transactionService.getTotalByType(type, req.user.userId),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    return this.transactionService.update(id, updateTransactionDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionService.remove(id, req.user.userId);
  }
}
