import { Module } from '@nestjs/common';
import { VehicletypeService } from './vehicletype.service';
import { VehicletypeController } from './vehicletype.controller';
import { DatabaseModule } from '@app/common';
import { VehicletypeDocument, VehicletypeSchema } from './entities/vehicletype.entity';
import { VehicletypeRepository } from './vehicletype.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
     {name:VehicletypeDocument.name,schema:VehicletypeSchema}
    ]),
  ],
  controllers: [VehicletypeController],
  providers: [VehicletypeService,VehicletypeRepository],
})
export class VehicletypeModule {}
