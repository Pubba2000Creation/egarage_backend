import { Test, TestingModule } from '@nestjs/testing';
import { GarageApiController } from './garage-api.controller';
import { GarageApiService } from './garage-api.service';

describe('GarageApiController', () => {
  let garageApiController: GarageApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GarageApiController],
      providers: [GarageApiService],
    }).compile();

    garageApiController = app.get<GarageApiController>(GarageApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(garageApiController.getHello()).toBe('Hello World!');
    });
  });
});
