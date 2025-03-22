import { Module } from '@nestjs/common';
import { VehicleInfoService } from './vehicle_info.service';
import { VehicleInfoController } from './vehicle_info.controller';

@Module({
  controllers: [VehicleInfoController],
  providers: [VehicleInfoService],
})
export class VehicleInfoModule {}
