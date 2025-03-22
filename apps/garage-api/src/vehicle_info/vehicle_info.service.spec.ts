import { Test, TestingModule } from '@nestjs/testing';
import { VehicleInfoService } from './vehicle_info.service';

describe('VehicleInfoService', () => {
  let service: VehicleInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleInfoService],
    }).compile();

    service = module.get<VehicleInfoService>(VehicleInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
