import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { VehicletypeDocument } from './entities/vehicletype.entity';

@Injectable()
export class VehicletypeRepository extends AbstractRepository<VehicletypeDocument> {
  protected readonly logger = new Logger(VehicletypeRepository.name);
  constructor(
    @InjectModel(VehicletypeDocument.name)
    protected readonly VehicletypeModel: Model<VehicletypeDocument>,
  ) {
    super(VehicletypeModel);
  }
}
