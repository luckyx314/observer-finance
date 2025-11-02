import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions') // plural and REST-consistent
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAllTransactions(@Query('userId') userId: number) {
    return this.transactionService.getAllTransactions(userId);
  }

  @Post('expenses')
  addExpense(@Body() expense: CreateExpenseDto) {
    return this.transactionService.addExpense(expense);
  }
}
