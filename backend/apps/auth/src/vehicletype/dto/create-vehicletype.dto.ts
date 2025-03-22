import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVehicletypeDto {

    @ApiProperty({ description: 'The name of the vehicle type' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'The category of the vehicle type' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({description:'The description of the vehicle type'})
    @IsString()
    description: string;

    @IsNumber()
    wheels: number;

    @ApiProperty({ description: 'The fuel type of the vehicle type' })
    @IsNotEmpty()
    @IsString({ each: true })
    fuelType: string[];

    @ApiProperty({ description: 'The status of the vehicle type' })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

}
