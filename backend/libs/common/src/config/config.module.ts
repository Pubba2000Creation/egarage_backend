import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available in your app
      envFilePath: '.env', // Path to your environment file
    }),
  ],
  exports: [NestConfigModule], // Export so other modules can access the config
})
export class ConfigModule {}
