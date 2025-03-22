import { Controller, Get } from '@nestjs/common';
import { GarageApiService } from './garage-api.service';

@Controller("Egarage")
export class GarageApiController {
  constructor(private readonly garageApiService: GarageApiService) {}

  @Get()
  getHello(): string {
    return this.garageApiService.getHello();
  }
}
