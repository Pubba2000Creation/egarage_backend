import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum, IsArray, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ServiceCenterStatus } from "../enum/ServiceCenterStatus.enum";

class LocationURL {
  @ApiProperty({ description: 'Longitude of the service center' })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty({ description: 'Latitude of the service center' })
  @IsNotEmpty()
  @IsString()
  latitude: string;
}

export class CreateServiceCenterDto {
  
  @ApiProperty({ description: 'ID of the service center owner' })
  userId: string;

  @ApiProperty({ description: 'Title of the service center' })
  @IsNotEmpty()
  @IsString()
  serviceTitle: string;

  @ApiProperty({ description: 'Categories of the service center' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  serviceCategories: string[];

  @ApiProperty({ description: 'Description of the service center' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Specialized vehicles of the service center' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  specializedVehicles: string[];

  @ApiProperty({ description: 'Mobile number of the service center' })
  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @ApiProperty({ description: 'Telephone number of the service center', required: false })
  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @ApiProperty({ description: 'Longitude and latitude of the service center' })
  @IsNotEmpty()
  @Type(() => LocationURL)
  locationURL: LocationURL;

  @ApiProperty({ description: 'Images of the service center', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageGallery?: string[];

  @ApiProperty({ description: 'Owner name of the service center' })
  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @ApiProperty({ description: 'Owner NIC of the service center' })
  @IsNotEmpty()
  @IsString()
  ownerNIC: string;

  @ApiProperty({ description: 'Business registration certificate of the service center' })
  @IsNotEmpty()
  @IsString()
  businessRegistrationCertificate: string;

  @ApiProperty({ description: 'The status of the service center', enum: ServiceCenterStatus, required: false })
  @IsOptional()
  @IsEnum(ServiceCenterStatus)
  status: ServiceCenterStatus; // Optional, defaults to PENDING
}
