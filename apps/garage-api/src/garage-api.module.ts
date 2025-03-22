import { Module } from '@nestjs/common';
import { GarageApiController } from './garage-api.controller';
import { GarageApiService } from './garage-api.service';
import { ReviewModule } from './review/review.module';
import { NewsModule } from './news/news.module';
import { NotificationModule } from './notification/notification.module';
import { VehicleInfoModule } from './vehicle_info/vehicle_info.module';

@Module({
  imports: [ReviewModule, NewsModule, NotificationModule, VehicleInfoModule],
  controllers: [GarageApiController],
  providers: [GarageApiService],
})
export class GarageApiModule {}
