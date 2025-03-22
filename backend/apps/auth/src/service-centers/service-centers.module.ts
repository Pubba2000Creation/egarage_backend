import { Module } from '@nestjs/common';
import { ServiceCentersService } from './service-centers.service';
import { ServiceCentersController } from './service-centers.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ServiceCenterDocument, ServiceCenterSchema } from './entities/service-center.entity';
import { serviceCenterRepository } from './service-centers.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {name:ServiceCenterDocument.name,schema:ServiceCenterSchema}
    ]),
    LoggerModule,
  ],
  controllers: [ServiceCentersController],
  providers: [ServiceCentersService,serviceCenterRepository],
})
export class ServiceCentersModule {}
