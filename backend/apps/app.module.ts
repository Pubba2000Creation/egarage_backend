import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GarageApiModule } from './garage-api/src/garage-api.module';
import { AuthModule } from './auth/src/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures environment variables are available globally
    }),
    AuthModule,
    GarageApiModule,
  ],
})
export class AppModule {}
