import { Test, TestingModule } from '@nestjs/testing';
import { VehicleInfoController } from './vehicle_info.controller';
import { VehicleInfoService } from './vehicle_info.service';

describe('VehicleInfoController', () => {
  let controller: VehicleInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleInfoController],
      providers: [VehicleInfoService],
    }).compile();

    controller = module.get<VehicleInfoController>(VehicleInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
