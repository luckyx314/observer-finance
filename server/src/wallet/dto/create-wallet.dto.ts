import { IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  balance: number;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  currency?: string;
}
