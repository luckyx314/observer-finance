import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { TransactionService } from './transaction/transaction.service';
import { TransactionType, TransactionStatus } from './transaction/entities/transaction.entity';
import { WalletService } from './wallet/wallet.service';
import { BudgetService } from './budget/budget.service';
import { PaymentReminderService } from './payment-reminder/payment-reminder.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const transactionService = app.get(TransactionService);
  const walletService = app.get(WalletService);
  const budgetService = app.get(BudgetService);
  const paymentReminderService = app.get(PaymentReminderService);

  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await userService.create({
    email: 'demo@example.com',
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    isEmailVerified: true,
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample wallets
  const wallets = [
    { name: 'Main Checking', balance: 12500, currency: 'PHP' },
    { name: 'Savings Vault', balance: 85000, currency: 'PHP' },
  ];

  for (const wallet of wallets) {
    await walletService.create(wallet, user.id);
  }

  console.log('✅ Created', wallets.length, 'sample wallets');

  const budgets = [
    {
      label: 'Food & Dining',
      category: 'Food',
      limit: 9000,
      description: 'Groceries, cafes, deliveries',
    },
    {
      label: 'Transportation',
      category: 'Transportation',
      limit: 4200,
      description: 'Fuel, ride shares, passes',
    },
    {
      label: 'Bills & Utilities',
      category: 'Bills',
      limit: 6800,
      description: 'Recurring bills and utilities',
    },
    {
      label: 'Entertainment',
      category: 'Entertainment',
      limit: 2400,
      description: 'Streaming, nights out',
    },
  ];

  for (const budget of budgets) {
    await budgetService.create(budget, user.id);
  }

  console.log('✅ Created', budgets.length, 'sample budgets');

  // Create sample transactions
  const transactions = [
    {
      merchant: 'Hackthebox',
      category: 'Subscription',
      type: TransactionType.EXPENSE,
      status: TransactionStatus.IN_PROCESS,
      amount: 18.93,
      date: '2025-11-01',
      description: 'Monthly subscription',
    },
    {
      merchant: 'Jollibee',
      category: 'Food',
      type: TransactionType.EXPENSE,
      status: TransactionStatus.DONE,
      amount: 29.39,
      date: '2025-11-05',
      description: 'Lunch',
    },
    {
      merchant: 'SM',
      category: 'Bills',
      type: TransactionType.EXPENSE,
      status: TransactionStatus.DONE,
      amount: 30.31,
      date: '2025-11-08',
      description: 'Shopping',
    },
    {
      merchant: 'Freelance Project',
      category: 'Income',
      type: TransactionType.INCOME,
      status: TransactionStatus.DONE,
      amount: 1500.0,
      date: '2025-11-10',
      description: 'Web development project',
    },
    {
      merchant: 'Uber',
      category: 'Transportation',
      type: TransactionType.EXPENSE,
      status: TransactionStatus.DONE,
      amount: 15.5,
      date: '2025-11-12',
      description: 'Ride to office',
    },
    {
      merchant: 'Udemy',
      category: 'Education',
      type: TransactionType.EXPENSE,
      status: TransactionStatus.DONE,
      amount: 89.99,
      date: '2025-11-13',
      description: 'Online course',
    },
    {
      merchant: 'Savings Account',
      category: 'Savings',
      type: TransactionType.SAVINGS,
      status: TransactionStatus.DONE,
      amount: 500.0,
      date: '2025-11-13',
      description: 'Monthly savings',
    },
  ];

  for (const transaction of transactions) {
    await transactionService.create(transaction, user.id);
  }

  console.log('✅ Created', transactions.length, 'sample transactions');

  const reminders = [
    {
      name: 'Power & Water',
      category: 'Bills',
      amount: 3200,
      dueDate: '2025-11-18',
      autoPay: true,
    },
    {
      name: 'Wellness Subscription',
      category: 'Healthcare',
      amount: 1450,
      dueDate: '2025-11-22',
      autoPay: false,
    },
    {
      name: 'Streaming Bundle',
      category: 'Entertainment',
      amount: 850,
      dueDate: '2025-11-26',
      autoPay: true,
    },
  ];

  for (const reminder of reminders) {
    await paymentReminderService.create(reminder, user.id);
  }

  console.log('✅ Created', reminders.length, 'payment reminders');
  console.log('');
  console.log('📝 Demo Credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🎉 Seeding completed!');

  await app.close();
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
