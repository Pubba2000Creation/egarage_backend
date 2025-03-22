import { Injectable } from '@nestjs/common';
import { CreateVehicletypeDto } from './dto/create-vehicletype.dto';
import { UpdateVehicletypeDto } from './dto/update-vehicletype.dto';
import { VehicletypeRepository } from './vehicletype.repository';

@Injectable()
export class VehicletypeService {
  constructor(private readonly vehicletypeRepository: VehicletypeRepository) {}
  create(createVehicletypeDto: CreateVehicletypeDto) {
    return this.vehicletypeRepository.create(createVehicletypeDto);
  }

  findAll() {
    return this.vehicletypeRepository.find({})
  }

  findOne(id: string) {
    return this.vehicletypeRepository.findOne({_id: id});
  }

  update(id: string, updateVehicletypeDto: UpdateVehicletypeDto) {
    return this.vehicletypeRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateVehicletypeDto }
    );
  }

  remove(id: string) {
    return this.vehicletypeRepository.findOneAndDelete({ _id: id });
  }
}
