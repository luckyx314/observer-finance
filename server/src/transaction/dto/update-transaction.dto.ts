import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  merchant?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
