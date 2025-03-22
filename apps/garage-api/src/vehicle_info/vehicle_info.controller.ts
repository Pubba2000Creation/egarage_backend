import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleInfoService } from './vehicle_info.service';
import { CreateVehicleInfoDto } from './dto/create-vehicle_info.dto';
import { UpdateVehicleInfoDto } from './dto/update-vehicle_info.dto';

@Controller('vehicle-info')
export class VehicleInfoController {
  constructor(private readonly vehicleInfoService: VehicleInfoService) {}

  @Post()
  create(@Body() createVehicleInfoDto: CreateVehicleInfoDto) {
    return this.vehicleInfoService.create(createVehicleInfoDto);
  }

  @Get()
  findAll() {
    return this.vehicleInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleInfoDto: UpdateVehicleInfoDto) {
    return this.vehicleInfoService.update(+id, updateVehicleInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleInfoService.remove(+id);
  }
}
