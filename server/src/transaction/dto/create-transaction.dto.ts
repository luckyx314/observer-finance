// src/modules/transactions/dto/create-transaction.dto.ts
import { IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVING = 'saving',
  LIABILITY = 'liability',
}

export class CreateTransactionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(TransactionType)
  trans_type: TransactionType;
}
