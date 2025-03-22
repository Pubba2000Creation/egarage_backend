import { Injectable } from '@nestjs/common';

@Injectable()
export class GarageApiService {
  getHello(): string {
    return 'Hello World! from Garage API';
  }
}
