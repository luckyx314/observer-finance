import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentReminder } from './entities/payment-reminder.entity';
import { CreatePaymentReminderDto } from './dto/create-payment-reminder.dto';
import { UpdatePaymentReminderDto } from './dto/update-payment-reminder.dto';

@Injectable()
export class PaymentReminderService {
  constructor(
    @InjectRepository(PaymentReminder)
    private readonly paymentReminderRepository: Repository<PaymentReminder>,
  ) {}

  async create(
    createPaymentReminderDto: CreatePaymentReminderDto,
    userId: number,
  ): Promise<PaymentReminder> {
    const reminder = this.paymentReminderRepository.create({
      ...createPaymentReminderDto,
      dueDate: new Date(createPaymentReminderDto.dueDate),
      userId,
    });
    return this.paymentReminderRepository.save(reminder);
  }

  async findAllByUser(userId: number): Promise<PaymentReminder[]> {
    return this.paymentReminderRepository.find({
      where: { userId },
      order: { dueDate: 'ASC' },
    });
  }

  async update(
    id: number,
    updatePaymentReminderDto: UpdatePaymentReminderDto,
    userId: number,
  ): Promise<PaymentReminder> {
    const reminder = await this.paymentReminderRepository.findOne({ where: { id, userId } });
    if (!reminder) {
      throw new NotFoundException('Payment reminder not found');
    }
    Object.assign(reminder, {
      ...updatePaymentReminderDto,
      ...(updatePaymentReminderDto.dueDate && {
        dueDate: new Date(updatePaymentReminderDto.dueDate),
      }),
    });
    return this.paymentReminderRepository.save(reminder);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.paymentReminderRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Payment reminder not found');
    }
  }
}
