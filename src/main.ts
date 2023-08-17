
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // only allow properties that are defined in the DTO
  }));

  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 5000; // process.env.SERVER_PORT;
  await app.listen(port);
}
bootstrap();
