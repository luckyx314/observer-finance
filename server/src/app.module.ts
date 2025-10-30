import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { SavingModule } from './saving/saving.module';
import { LiabilityModule } from './liability/liability.module';

@Module({
  imports: [UserModule, TransactionModule, IncomeModule, ExpenseModule, SavingModule, LiabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
