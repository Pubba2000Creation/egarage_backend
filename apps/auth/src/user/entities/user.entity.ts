import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enum/userRole.enum';
import { UserType } from '../enum/userType.enum';
import { UserStatus } from '../enum/userStatus.enum';


@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({ type: String, required: false })
  userFirstName?: string;

  @Prop({ type: String, required: false })
  userLastName?: string;

  @Prop({ type: Date, required: false })
  DateofBirth?: Date;

  @Prop({ type: String, required: false, default: '' })
  vehicleType?: string;

  @Prop({ type: String, required: false, default: '' })
  companyName?: string;

  @Prop({ type: String, required: false })
  phoneNumber: string;

  @Prop({ type: String, required: false, default: '' })
  address?: string;

  @Prop({ type: String, required: false, default: '' })
  Province?: string;

  @Prop({ type: String, required: false, default: '' })
  City?: string;

  @Prop({ type: String, required: false, default: '' })
  ProfilePicture?: string;

  @Prop({ type: String, required: false, unique: true })
  userEmail: string;

  @Prop({ type: String, required: false })
  userPassword: string;

  @Prop({ type: String, required: false, default: '' })
  OTP?: string;

  @Prop({ type: String, enum: UserType, required: false, default: UserType.USER })
  userType: UserType;

  @Prop({
    type: [String],
    enum: UserRole,
    required: false,
    default: [UserRole.USER],
  })
  userRoles: UserRole[];

  @Prop({
    type: String,
    enum: UserStatus,
    required: false,
    default: UserStatus.Active,
  })
  status?: UserStatus;

  @Prop({ default: false })
  isVerified?: boolean;

  @Prop({ type: Number })
  verificationToken?: number;

  @Prop({ type: Date })
  verificationExpiresAt: Date;

  @Prop({type:String,required:false})
  refreshToken?:string

  @Prop({type:Number,required:false})
  conformationcode?:number
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
