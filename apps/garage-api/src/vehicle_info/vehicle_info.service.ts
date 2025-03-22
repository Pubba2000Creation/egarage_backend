import { Injectable } from '@nestjs/common';
import { CreateVehicleInfoDto } from './dto/create-vehicle_info.dto';
import { UpdateVehicleInfoDto } from './dto/update-vehicle_info.dto';

@Injectable()
export class VehicleInfoService {
  create(createVehicleInfoDto: CreateVehicleInfoDto) {
    return 'This action adds a new vehicleInfo';
  }

  findAll() {
    return `This action returns all vehicleInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleInfo`;
  }

  update(id: number, updateVehicleInfoDto: UpdateVehicleInfoDto) {
    return `This action updates a #${id} vehicleInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleInfo`;
  }
}
