// src/modules/transactions/dto/create-expense.dto.ts
import { IsString } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class CreateExpenseDto extends CreateTransactionDto {
  @IsString()
  merchant: string;

  @IsString()
  category: string;
}
