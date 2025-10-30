import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';

@Module({
  controllers: [ExpenseController]
})
export class ExpenseModule {}
