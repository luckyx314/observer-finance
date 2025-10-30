import { Module } from '@nestjs/common';
import { SavingController } from './saving.controller';

@Module({
  controllers: [SavingController]
})
export class SavingModule {}
