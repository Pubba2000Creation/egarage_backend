import { BadRequestException, Body, ConflictException, Controller, Get, HttpException, HttpStatus, Logger, NotFoundException, Param, Post, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterUserDto } from './dto/register.dto';
import { CommonResponseDto } from '@app/common';
import { authLoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { authForgotPasswordDto } from './dto/forgotPassword.dto';
import { authResetPasswordConformDto } from './dto/resetPasswordConform.dto';
import { authResetPasswordDto } from './dto/resetPassword.dto';
import { FileInterceptor } from '@nestjs/platform-express';



@ApiTags('authentication oprations of the system')
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthService.name);

  /**
   * 
   * @param registerUserDto 
   * 
   * 
  
   * @returns CommonResponseDto ************************************************************************************
   */

  @Post('register')
  @ApiBody({ type: AuthRegisterUserDto }) // Defines request body for Swagger
  @ApiResponse({
    status: 201,
    description: 'User Crated and verify OTP',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User already exists.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    type: CommonResponseDto,
  })
  async register(
    @Body() registerUserDto: AuthRegisterUserDto,
  ): Promise<CommonResponseDto> {
    try {
      const responseData = await this.authService.register(registerUserDto); 
      return new CommonResponseDto(true, 'User created and verify OTP', responseData.document);
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message,null ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


/**
 * Verify OTP code for the user.
 * 
 * @param {string} otp - The OTP code to verify.
 * 
 * @returns {CommonResponseDto} - A response indicating the result of the OTP verification******************************************.
 */
  @Post('verify-otp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'number', description: 'The OTP code to verify', example: '123456' },
      },
      required: ['otp'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, user account activated.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'OTP not found or invalid.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'OTP has expired.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    type: CommonResponseDto,
  })
  async verifyOTP(@Body('otp') otp: number): Promise<CommonResponseDto> {
    try {
      // Check if the provided OTP is valid
      if (!otp) {
        throw new HttpException(
          new CommonResponseDto(false, 'OTP is required.', null),
          HttpStatus.BAD_REQUEST,
        );
      }
      // Call service to verify the OTP
      const responseData = await this.authService.verifyOTP(otp);
  
      // Return success response
      return new CommonResponseDto(
        true,
        'OTP verified successfully, user account activated.',
        responseData.document,
      );
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message,null ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  
/**
 * Resend OTP code to the user.
 * 
 * @query {string} userEmail - The email address of the user to resend the OTP.
 * 
 * @returns {CommonResponseDto} - A response indicating whether the OTP was sent successfully.********************************************
 */
  @Post('resend-otp')
  @ApiQuery({ name: 'userEmail', type: String, required: true, description: 'The email address of the user' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    type: CommonResponseDto,
  })
  async resendOTP(@Query('userEmail') userEmail: string): Promise<CommonResponseDto> {
    try {
      // Attempt to resend OTP
      console.log(userEmail);
      const responsedata = await this.authService.resendOTP(userEmail);
      
      // Log success event
      this.logger.log(`OTP resent successfully to ${userEmail}`);
      
      return new CommonResponseDto(true, 'OTP sent successfully', responsedata.document);
    } catch (error) {
        // Handle unexpected errors
        throw new HttpException(
          new CommonResponseDto(false, error.message,null ),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      
    }
  }
  

  /**
   * API for user login
   * 
   * @param {AuthLoginUserDto} loginUserDto
   * 
   * @returns {CommonResponseDto}
   */
  @Post('login')
  @ApiBody({ type: authLoginDto }) // You can define a DTO for the login body
  @ApiResponse({
     status: 200, 
     description: 'Login successful', 
     type: CommonResponseDto 
    })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials', 
    type: CommonResponseDto 
  })
  async login(@Body() loginUserDto: authLoginDto): Promise<CommonResponseDto> {
    try {
      const responseData = await this.authService.login(loginUserDto);
      return new CommonResponseDto(true, 'User logged in successfully', responseData);
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message,null ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 
   * @param refreshToken 
   * @returns 
   */
  @Post('refresh-token')
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens refreshed', 
    type: CommonResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired refresh token', 
    type: CommonResponseDto })
  async refreshTokens(@Body('refreshToken') refreshToken: string): Promise<CommonResponseDto> {
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken);
    
    return new CommonResponseDto(true, 'Tokens refreshed', { accessToken, refreshToken: newRefreshToken });
  }


  //test auth gard
  @Post('protected')
  @UseGuards(AuthGuard)
  @ApiResponse({ 
    status: 200, 
    description: 'Protected route accessed', 
    type: CommonResponseDto 
  })
  async protectedRoute(@Req() req): Promise<CommonResponseDto> {
    return new CommonResponseDto(true, 'You are authenticated!', req.user);
  }



  /**
   * API for user logout
   */
  @Post('logout')
  @UseGuards(AuthGuard) // Protect the route
  @ApiResponse({ 
    status: 200, 
    description: 'User logged out', 
    type: CommonResponseDto 
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: CommonResponseDto,
  })
  async logout(@Req() req): Promise<CommonResponseDto> {
    try {
      await this.authService.logout(req.user.sub); // `sub` is typically the userId in the JWT payload
      return new CommonResponseDto(true, 'User logged out');
    } catch (error) {
      throw new UnauthorizedException('Logout failed');
    }
  }



 /**
  * api for request forgot password
  * 
  * @param {authForgotPasswordDto} forgotPasswordDto
  */

 @Post('forgot-password')
 @ApiBody({ type: authForgotPasswordDto })
 @ApiResponse({
   status: 200,
   description: 'Conformation Code sent successfully',
   type: CommonResponseDto,
 })
 @ApiResponse({
   status: 404,
   description: 'User not found',
   type: CommonResponseDto,
 })
 @ApiResponse({
   status: 500,
   description: 'Internal server error.',
   type: CommonResponseDto,
 })
 async requestForgotPassword(@Body() forgotPasswordDto: authForgotPasswordDto): Promise<CommonResponseDto> {
   try {
     const responseData = await this.authService.forgotPasswordRequest(forgotPasswordDto);
     return new CommonResponseDto(true, 'Conformation Code sent successfully', responseData.document);
   } catch (error) {
     // Handle unexpected errors
     throw new HttpException(
       new CommonResponseDto(false, error.message,null ),
       HttpStatus.INTERNAL_SERVER_ERROR,
     );
    }
  }



 /**
  * api for confirmation code of the forgot password
  * 
  * @param {authResetPasswordConformDto} varifyConformationCodeDto
  */
  @Post('verify-confirmationCode')
  @ApiBody({ type: authResetPasswordConformDto })
  @ApiResponse({
    status: 200,
    description: 'Conformation Code validated successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Conformation Code invalid',
    type: CommonResponseDto,
  })
  async verifyConformationCode(@Body() varifyConformationCodeDto: authResetPasswordConformDto): Promise<CommonResponseDto> {
    try {
      const responseData = await this.authService.varifyConformationCode(varifyConformationCodeDto);
      return new CommonResponseDto(true, 'Conformation Code validated successfully', responseData.message);
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message,null ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  /**
   * api for reset password
   * 
   * @param {authResetPasswordDto} resetPasswordDto
   */

  @Post('reset-password')
  @ApiBody({ type: authResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    type: CommonResponseDto,
  })
  async resetPassword(@Body() resetPasswordDto: authResetPasswordDto): Promise<CommonResponseDto> {
    try {
      const responseData = await this.authService.resetPassword(resetPasswordDto);
      return new CommonResponseDto(true, 'Password reset successfully', responseData.document);
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message,null ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * api for change userrole
   * 
   */

  @Post('change-userrole')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userEmail: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'USER/SERVICE OWNER' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role changed successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: CommonResponseDto,
  })
  async changeUserRole(
    @Body('userEmail') userEmail: string,
    @Body('role') role: string,
  ): Promise<CommonResponseDto> {
    try {
      const updatedUser = await this.authService.addUserrole(userEmail, role);
      return new CommonResponseDto(
        true,
        'User role changed successfully',
        updatedUser.document,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          new CommonResponseDto(false, 'User not found', null),
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, 'Internal server error', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  /**
   * API to upload a user's profile picture
   * 
   */
  @Post('upload-profile-picture')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userEmail: { type: 'string', example: 'user@example.com' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: CommonResponseDto,
  })
  @UseInterceptors(FileInterceptor('file')) // Intercepts file uploads
  async uploadProfilePicture(
    @Body('userEmail') userEmail: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommonResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const updatedUser = await this.authService.addUserImageUrl(userEmail, file);
      return new CommonResponseDto(
        true,
        'Profile picture uploaded successfully',
        updatedUser.document,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          new CommonResponseDto(false, 'User not found', null),
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, 'Internal server error', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}
