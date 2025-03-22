import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule, S3Module } from '@app/common';
import { ServiceCentersModule } from './service-centers/service-centers.module';
import { AnaliticsModule } from './analitics/analitics.module';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { VehicletypeModule } from './vehicletype/vehicletype.module';

@Module({
  imports: [
    ConfigModule,
    S3Module,
    EmailModule,
    UserModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Dynamically load the JWT secret from .env
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') }, // Load the expiration time
      }),
      inject: [ConfigService], // Inject ConfigService here
    }),
    ServiceCentersModule,
    AnaliticsModule,
    ServiceCategoryModule,
    VehicletypeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
