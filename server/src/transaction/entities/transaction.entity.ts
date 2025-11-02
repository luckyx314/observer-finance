import { CreateTransactionDto } from '../dto/create-transaction.dto';

export interface Transaction extends CreateTransactionDto {
  trans_id: number;
  income?: {
    source: string;
    description: string;
  };
  expense?: {
    merchant: string;
    category: string;
  };
  saving?: {
    source: string;
    description: string;
  };
  liability?: {
    creditor: string;
    due_date: string;
  };
}
