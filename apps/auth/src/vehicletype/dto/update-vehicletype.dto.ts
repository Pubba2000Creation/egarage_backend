import { PartialType } from '@nestjs/swagger';
import { CreateVehicletypeDto } from './create-vehicletype.dto';

export class UpdateVehicletypeDto extends PartialType(CreateVehicletypeDto) {}
