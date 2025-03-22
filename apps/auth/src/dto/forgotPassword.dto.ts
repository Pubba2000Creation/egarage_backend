import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class authForgotPasswordDto {
    @ApiProperty({ description: 'The email of the user' })
    @IsEmail()
    email: string;
}