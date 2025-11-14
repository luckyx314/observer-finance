import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { User } from './user/entities/user.entity';
import { Transaction } from './transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'observer-finance.db',
      entities: [User, Transaction],
      synchronize: true, // Set to false in production
      logging: false,
    }),
    AuthModule,
    UserModule,
    TransactionModule,
  ],
})
export class AppModule {}
