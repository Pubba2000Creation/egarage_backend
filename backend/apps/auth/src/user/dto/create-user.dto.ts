import { IsEmail, IsEnum, IsOptional, IsString, IsArray, IsBoolean, IsNumber, IsDate, MinLength } from 'class-validator';
import { UserStatus } from '../enum/userStatus.enum';
import { UserRole } from '../enum/userRole.enum';
import { UserType } from '../enum/userType.enum';


export class CreateUserDto {
  @IsOptional()
  @IsString()
  userFirstName?: string;

  @IsOptional()
  @IsString()
  userLastName?: string;

  @IsOptional()
  @IsDate()
  DateofBirth?: Date;

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  Province?: string;

  @IsOptional()
  @IsString()
  City?: string;

  @IsOptional()
  @IsString()
  ProfilePicture?: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @MinLength(6)
  userPassword: string;

  @IsOptional()
  @IsString()
  OTP?: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  userRoles?: UserRole[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsNumber()
  verificationToken?: number;

  @IsOptional()
  @IsDate()
  verificationExpiresAt?: Date;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsNumber()
  conformationcode?: number;
}
