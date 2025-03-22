import { Injectable, ConflictException, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { AuthRegisterUserDto } from './dto/register.dto';
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';
import { UserType } from './user/enum/userType.enum';
import { UserRole } from './user/enum/userRole.enum';
import { UserStatus } from './user/enum/userStatus.enum';
import { v4 as uuidv4 } from 'uuid';
import { authLoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { authForgotPasswordDto } from './dto/forgotPassword.dto';
import { authResetPasswordDto } from './dto/resetPassword.dto';
import { authResetPasswordConformDto } from './dto/resetPasswordConform.dto';
import { EmailService, S3Service } from '@app/common';

@Injectable()
export class AuthService {
    
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService


  ) {}
  private readonly logger = new Logger(AuthService.name);

    async register(registerUserDto: AuthRegisterUserDto) {
      const { userEmail, phoneNumber, userPassword, userFirstName, userLastName } = registerUserDto;

      try {
        const filterQuery = { $or: [{ userEmail }, { phoneNumber }] };
        const existingUser = await this.userRepository.findOne(filterQuery);

        if (existingUser?.document) {
          throw new ConflictException('A user with this email or phone number already exists.');
        }

        const hashedPassword = await hash(userPassword, 10);
        const otp = this.generateOTP();
        const otpExpiresAt = new Date(Date.now() + 19 * 60 * 1000); // 19 minutes

        const newUser = {
          userFirstName,
          userLastName,
          userEmail,
          phoneNumber,
          userPassword: hashedPassword,
          userType: UserType.USER,
          userRoles: [UserRole.USER],
          status: UserStatus.Active,
          isVerified: false,
          verificationToken: otp,
          verificationExpiresAt: otpExpiresAt,
          refreshToken:null,
          conformationcode:null,
        };

        const userResponse = await this.userRepository.create(newUser);
        this.logger.log(`User registered with OTP: ${otp}`);

        // Send verification email
        await this.emailService.sendVerificationEmail(userEmail, otp);

        //return user details
        return userResponse;

        //end of the code
      } catch (error) {
        this.logger.error(`Error in register: ${error.message}`, error.stack);
        throw new ConflictException(error.message);
      }
    }

    private generateOTP(): number {
      return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
    }

    //method for verify otp
    async verifyOTP(otp: number) {
      try {
        // Log the start of the OTP verification process
        this.logger.log(`Verifying OTP: ${otp}`);
        
        // Fetch the user associated with the provided OTP
        const user = await this.userRepository.findOne({ verificationToken: otp });
    
        // Check if the user with the given OTP exists
        if (!user?.document) {
          // Log a warning and throw an error if the OTP is invalid
          this.logger.warn(`Invalid OTP: ${otp}`);
          throw new NotFoundException('User not found for given OTP');
        }

        if (user.document.isVerified) {
          // Log a warning and throw a ConflictException if the user is already verified
          this.logger.warn(`User already verified: ${user.document._id}`);
          throw new ConflictException('User already verified');
        }
    
        // Verify that the OTP is still within its valid time frame
        if (user.document.verificationExpiresAt < new Date()) {
          // Log a warning and throw an error if the OTP is expired
          this.logger.warn(`OTP not expired for user: ${user.document._id}`);
          throw new ConflictException('OTP not expired');
        }
    
        // Update the user's verification status in the database
        const updatedUser = await this.userRepository.findOneAndUpdate(
          { _id: user.document._id },
          { $set: { isVerified: true } }, // Set the isVerified flag to true
        );
    
        // Log the successful verification of the user
        this.logger.log(`User successfully verified: ${user.document._id}`);
        
        // Return the updated user object
        return updatedUser;
      } catch (error) {
        // Log the error details in case of failure during the OTP verification process
        this.logger.error(`Error verifying OTP: ${error.message}`, error.stack);
        
        // Re-throw the error to propagate it to the caller
        throw error;
      }
    }
    
  
    //method for resend otp
    async resendOTP(userEmail: string) {

      //if email wos not provide
      if (!userEmail) {
        throw new NotFoundException('Email is required');
      }
      // Find the user by email
      const user = await this.userRepository.findOne({ userEmail });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      // Check if the user is already verified
      if (user.document.isVerified) {
        // If user is verified, return message and user details
      throw new ConflictException('User already verified');
      }
    
      // Check if OTP is still valid
      if (user.document.verificationExpiresAt > new Date()) {
        throw new ConflictException('OTP not expired');
      }
    
      // Generate a new OTP
      const otp = this.generateOTP();
    
      // Update the user's OTP and expiration time
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: user.document._id },
        {
          $set: {
            verificationToken: otp,
            verificationExpiresAt: new Date(Date.now() + 19 * 60 * 1000), // 19 minutes
          },
        },
      );

      //send otp email to user 
      await this.emailService.sendOTP(userEmail, otp);
    
      //return the update user information
      return updatedUser;

    }

    // Method to validate access token
    async verifyAccessToken(token: string): Promise<boolean> {
      try {
        const payload = this.jwtService.verify(token);  // This will automatically use the secret defined in the JWTModule
        return !!payload;  // Will throw an error if invalid
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    // Generate JWT tokens (access and refresh)
    async generateTokens(userEmail: string) {
      const user = await this.userRepository.findOne({ userEmail });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const payload = { email: user.document.userEmail, sub: user.document._id };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Store the refresh token in the database
      await this.userRepository.findOneAndUpdate(
        { _id: user.document._id },
        { $set: { refreshToken } }
      );

      return { accessToken, refreshToken };
    }

    // Method to handle login and return tokens``
    async login(loginUserDto: authLoginDto) {
      const user = await this.userRepository.findOne({ userEmail: loginUserDto.email });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await compare(loginUserDto.password, user.document.userPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.generateTokens(loginUserDto.email);
    }

    // Method to handle refresh token logic
    async refreshTokens(refreshToken: string) {
      try {
        const payload = this.jwtService.verify(refreshToken);

        // You can handle expiration and revoke logic here
        return this.generateTokens(payload.email);
      } catch (e) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
    }

    
    //method for logout funtion
    async logout(userId: string): Promise<void> {
      const result = await this.userRepository.findOneAndUpdate(
        { _id: userId },
        { $set: { refreshToken: null } } // Clear the refresh token
      );

      if (!result) {
        throw new UnauthorizedException('User not found or logout failed');
      }
    }

    //method for forgot password
    async forgotPasswordRequest(forgetPasswordDto: authForgotPasswordDto) {

      //find if user avalabe for given email
      const user = await this.userRepository.findOne({ userEmail: forgetPasswordDto.email });

      //if the user not found
      if (!user) {
        throw new NotFoundException('User not found');
      }
      //if the user are avalabe and verified need to send email
      const newconformationcode = this.generateOTP();

      //save conformation code in database
      const updateUser =await this.userRepository.findOneAndUpdate(
        {_id: user.document._id,},
        {
          $set:{
            conformationcode: newconformationcode,
          }
        }
        
      )

      //send email to user
      await this.emailService.forgotPassword(forgetPasswordDto.email, newconformationcode);

      //return update user info 
      return updateUser
      
      
    }

    //method for verify comfirmation code
    async varifyConformationCode(varifyConformationCodeDto: authResetPasswordConformDto) {
      //find if user avalabe for given email
      const user = await this.userRepository.findOne({ userEmail: varifyConformationCodeDto.userEmail });

      //if the user not found
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      //cehck if the given comformation code was correct with the one in database
      if (user.document.conformationcode !== varifyConformationCodeDto.conformationcode) {
        throw new ConflictException('Invalid conformation code');
      }else{
        return user
      }
    }

    //method for reset password
    async resetPassword(resetPasswordDto: authResetPasswordDto) {
      

      const user = await this.userRepository.findOne({ _id: resetPasswordDto.userId });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await hash(resetPasswordDto.newPassword, 10);

      const updateUser = await this.userRepository.findOneAndUpdate(
        { _id: user.document._id },
        {
          $set: {
            userPassword: hashedPassword,
            conformationcode: null,
          },
        }
      )

      return updateUser
    }


    //method for add user role
    async addUserrole(userEmail: string, role: string) {
      
      //find if user avalabe for given email
      const user = await this.userRepository.findOne({ userEmail });

      if(!user){
        throw new NotFoundException('User not found');
      }

        const updateUser = await this.userRepository.findOneAndUpdate(
      { _id: user.document._id },
      {
        $addToSet: { userRoles: role }, // Add multiple roles, avoiding duplicates
      },
      
    );

      
      return updateUser

    }

    //method for add user image file and url
    async addUserImageUrl(userEmail: string, file: Express.Multer.File) {
      // Find if the user exists for the given email
      const user = await this.userRepository.findOne({ userEmail });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      try {
        // Upload the file to AWS S3
        const result = await this.s3Service.uploadOneFile(file);
        const imageUrl = result.document; // Ensure this value comes correctly from S3
        console.log('Image URL:', imageUrl);

        // Update the user's profile picture using findOneAndUpdate
        const  updatedUser  = await this.userRepository.findOneAndUpdate(
          { _id: user.document._id },
          { $set: { ProfilePicture: imageUrl } } // Update the profile picture
        );

        //console.log('Update message:', message); // Log the message if needed
        return updatedUser

      } catch (error) {
        console.error('Error uploading file or updating user:', error.message);
        throw new Error('Failed to upload image or update user profile');
      }
    }
  


}
