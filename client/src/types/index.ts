export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export const TransactionType = {
  EXPENSE: "Expense",
  INCOME: "Income",
  SAVINGS: "Savings",
  LIABILITY: "Liability",
  INVESTMENT: "Investment",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  IN_PROCESS: "In Process",
  DONE: "Done",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export interface Transaction {
  id: number;
  merchant: string;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  date: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  merchant: string;
  category: string;
  type: TransactionType;
  status?: TransactionStatus;
  amount: number;
  date: string;
  description?: string;
}

export interface UpdateTransactionDto {
  merchant?: string;
  category?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  amount?: number;
  date?: string;
  description?: string;
}
