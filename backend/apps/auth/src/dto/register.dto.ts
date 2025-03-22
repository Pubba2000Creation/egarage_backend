import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRegisterUserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  userFirstName: string;

  @ApiProperty({ description: 'Last name of the user (optional)' })
  @IsString()
  userLastName: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ description: 'The phone number of the user' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  userPassword: string;
}
