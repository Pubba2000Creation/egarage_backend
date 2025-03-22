import { PartialType } from '@nestjs/swagger';
import { CreateServiceCenterDto } from './create-service-center.dto';

export class UpdateServiceCenterDto extends PartialType(CreateServiceCenterDto) {}
