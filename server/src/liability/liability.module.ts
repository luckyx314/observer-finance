import { Module } from '@nestjs/common';
import { LiabilityController } from './liability.controller';

@Module({
  controllers: [LiabilityController]
})
export class LiabilityModule {}
