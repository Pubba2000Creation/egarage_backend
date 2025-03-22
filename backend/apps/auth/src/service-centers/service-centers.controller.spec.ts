import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCentersController } from './service-centers.controller';
import { ServiceCentersService } from './service-centers.service';

describe('ServiceCentersController', () => {
  let controller: ServiceCentersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCentersController],
      providers: [ServiceCentersService],
    }).compile();

    controller = module.get<ServiceCentersController>(ServiceCentersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
