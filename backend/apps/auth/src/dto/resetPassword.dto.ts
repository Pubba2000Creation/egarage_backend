import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class authResetPasswordDto {
    @ApiProperty({description:'the varification code'})
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({description:'the new password'})
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}