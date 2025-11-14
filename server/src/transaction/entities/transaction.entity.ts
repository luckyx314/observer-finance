import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum TransactionType {
  EXPENSE = 'Expense',
  INCOME = 'Income',
  SAVINGS = 'Savings',
  LIABILITY = 'Liability',
  INVESTMENT = 'Investment',
}

export enum TransactionStatus {
  IN_PROCESS = 'In Process',
  DONE = 'Done',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchant: string;

  @Column()
  category: string;

  @Column({
    type: 'text',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'text',
    enum: TransactionStatus,
    default: TransactionStatus.DONE,
  })
  status: TransactionStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
