import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class authResetPasswordConformDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description:'the varification code'})
    conformationcode: number;

    @IsEmail()
    @ApiProperty({description:'the email of the user'})
    userEmail: string
}