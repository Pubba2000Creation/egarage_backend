import { Module } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { AnaliticsController } from './analitics.controller';

@Module({
  controllers: [AnaliticsController],
  providers: [AnaliticsService],
})
export class AnaliticsModule {}
