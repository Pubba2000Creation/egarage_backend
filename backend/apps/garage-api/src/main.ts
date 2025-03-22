import { NestFactory } from '@nestjs/core';
import { GarageApiModule } from './garage-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GarageApiModule);

  const config = new DocumentBuilder()
    .setTitle('E-Garage API')
    .setDescription('API documentation for E-Garage system')
    .setVersion('1.0')
    .addTag('garages')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3002); // Adjust the port if needed
}
bootstrap();
