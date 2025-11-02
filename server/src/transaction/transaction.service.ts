import { Injectable } from '@nestjs/common';
import {
  CreateTransactionDto,
  TransactionType,
} from './dto/create-transaction.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

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

@Injectable()
export class TransactionService {
  private transactions: Transaction[] = [
    {
      trans_id: 1,
      user_id: 1,
      amount: 2500.0,
      date: '2025-10-28',
      trans_type: TransactionType.INCOME,
      income: {
        source: 'TechCorp Salary',
        description: 'October paycheck',
      },
    },
    {
      trans_id: 2,
      user_id: 1,
      amount: 120.5,
      date: '2025-10-29',
      trans_type: TransactionType.EXPENSE,
      expense: {
        merchant: 'Walmart',
        category: 'Groceries',
      },
    },
    {
      trans_id: 3,
      user_id: 1,
      amount: 400.0,
      date: '2025-10-30',
      trans_type: TransactionType.SAVING,
      saving: {
        source: 'Emergency Fund',
        description: 'Monthly savings deposit',
      },
    },
    {
      trans_id: 4,
      user_id: 1,
      amount: 900.0,
      date: '2025-11-01',
      trans_type: TransactionType.LIABILITY,
      liability: {
        creditor: 'Visa Credit Card',
        due_date: '2025-11-25',
      },
    },
    {
      trans_id: 5,
      user_id: 2,
      amount: 3100.0,
      date: '2025-10-28',
      trans_type: TransactionType.INCOME,
      income: {
        source: 'Freelance Project',
        description: 'Web design contract',
      },
    },
    {
      trans_id: 6,
      user_id: 2,
      amount: 75.25,
      date: '2025-10-30',
      trans_type: TransactionType.EXPENSE,
      expense: {
        merchant: 'Netflix',
        category: 'Entertainment',
      },
    },
  ];

  getAllTransactions(userId: number): Transaction[] {
    return this.transactions.filter(
      (transaction) => transaction.user_id === +userId,
    );
  }

  addExpense(data: CreateExpenseDto): Transaction {
    const newTransaction: Transaction = {
      trans_id: this.transactions.length + 1,
      user_id: data.user_id,
      amount: data.amount,
      date: data.date,
      trans_type: TransactionType.EXPENSE,
      expense: {
        merchant: data.merchant,
        category: data.category,
      },
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }
}
