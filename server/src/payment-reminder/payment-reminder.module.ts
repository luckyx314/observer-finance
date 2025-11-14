import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentReminder } from './entities/payment-reminder.entity';
import { PaymentReminderService } from './payment-reminder.service';
import { PaymentReminderController } from './payment-reminder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentReminder])],
  controllers: [PaymentReminderController],
  providers: [PaymentReminderService],
  exports: [PaymentReminderService],
})
export class PaymentReminderModule {}
