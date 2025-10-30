import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';

@Module({
  controllers: [IncomeController]
})
export class IncomeModule {}
