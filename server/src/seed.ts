import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { TransactionService } from './transaction/transaction.service';
import { TransactionType, TransactionStatus } from './transaction/entities/transaction.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const transactionService = app.get(TransactionService);

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
