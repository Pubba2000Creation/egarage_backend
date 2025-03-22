import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ServiceCategoryDocument, ServiceCategorySchema } from './entities/service-category.entity';
import { ServiceCategoryRepository } from './service-category.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ServiceCategoryDocument.name, schema: ServiceCategorySchema },
    ]),
    LoggerModule,
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService, LoggerModule,ServiceCategoryRepository],
})
export class ServiceCategoryModule {}
