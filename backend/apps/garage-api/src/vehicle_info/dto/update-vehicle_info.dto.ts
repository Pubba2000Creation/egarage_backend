import { PartialType } from '@nestjs/swagger';
import { CreateVehicleInfoDto } from './create-vehicle_info.dto';

export class UpdateVehicleInfoDto extends PartialType(CreateVehicleInfoDto) {}
