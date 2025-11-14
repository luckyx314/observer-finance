import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { User } from './user/entities/user.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { WalletModule } from './wallet/wallet.module';
import { Budget } from './budget/entities/budget.entity';
import { BudgetModule } from './budget/budget.module';
import { PaymentReminder } from './payment-reminder/entities/payment-reminder.entity';
import { PaymentReminderModule } from './payment-reminder/payment-reminder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'observer-finance.db',
      entities: [User, Transaction, Wallet, Budget, PaymentReminder],
      synchronize: true, // Set to false in production
      logging: false,
    }),
    AuthModule,
    UserModule,
    TransactionModule,
    WalletModule,
    BudgetModule,
    PaymentReminderModule,
  ],
})
export class AppModule {}
