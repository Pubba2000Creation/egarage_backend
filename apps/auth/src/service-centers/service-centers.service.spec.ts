import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCentersService } from './service-centers.service';

describe('ServiceCentersService', () => {
  let service: ServiceCentersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceCentersService],
    }).compile();

    service = module.get<ServiceCentersService>(ServiceCentersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
