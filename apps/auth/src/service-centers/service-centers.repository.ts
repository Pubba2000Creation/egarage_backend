import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { ServiceCenterDocument } from './entities/service-center.entity';

@Injectable()
export class serviceCenterRepository extends AbstractRepository<ServiceCenterDocument> {
  protected readonly logger = new Logger(serviceCenterRepository.name);
  constructor(
    @InjectModel(ServiceCenterDocument.name)
    protected readonly ServiceCenterModel: Model<ServiceCenterDocument>,
  ) {
    super(ServiceCenterModel);
  }
}
    