import { Injectable } from '@nestjs/common';
import { CreateAnaliticDto } from './dto/create-analitic.dto';
import { UpdateAnaliticDto } from './dto/update-analitic.dto';

@Injectable()
export class AnaliticsService {
  create(createAnaliticDto: CreateAnaliticDto) {
    return 'This action adds a new analitic';
  }

  findAll() {
    return `This action returns all analitics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analitic`;
  }

  update(id: number, updateAnaliticDto: UpdateAnaliticDto) {
    return `This action updates a #${id} analitic`;
  }

  remove(id: number) {
    return `This action removes a #${id} analitic`;
  }
}
