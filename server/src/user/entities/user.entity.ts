import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Budget } from '../../budget/entities/budget.entity';
import { PaymentReminder } from '../../payment-reminder/entities/payment-reminder.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationCode: string | null;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  emailVerificationCodeExpiresAt: Date | null;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  passwordResetTokenExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => PaymentReminder, (reminder) => reminder.user)
  paymentReminders: PaymentReminder[];
}
