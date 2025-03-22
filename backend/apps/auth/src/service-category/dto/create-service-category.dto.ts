import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { serviceCategoryStatus, serviceCategorycreatedBy } from "../enum/serviceCategoryStatus.enum"; // Corrected import

export class CreateServiceCategoryDto { 

  @ApiProperty({ description: 'Name of the service category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the service category', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The status of the service category', enum: serviceCategoryStatus })
  @IsEnum(serviceCategoryStatus)
  status?: serviceCategoryStatus = serviceCategoryStatus.PENDING; // Default to 'PENDING'

  @ApiProperty({ description: 'Who created the service category', enum: serviceCategorycreatedBy, required: false })
  @IsOptional()
  @IsEnum(serviceCategorycreatedBy)
  createdBy?: serviceCategorycreatedBy = serviceCategorycreatedBy.admin; // Default to 'admin'

}
