
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import helmet from 'helmet';
import {ValidationError} from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // only allow properties that are defined in the DTO
    // forbidNonWhitelisted: true, // throw an error if a non-whitelisted property is encountered
    // transform: true, // transform the payload to the DTO type
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      // TODO: change validation message for regex fields
      return new BadRequestException(
          // validationErrors.map((error) => ({
          //   field: error.property,
          //   error: Object.values(error.constraints).join(', '),
          // })),
          {
            success: false,
            message: validationErrors.map((error) => Object.values(error.constraints).join(', ')).join(', '),
          }
      );
    },
  }));

  const configService = app.get(ConfigService);
  const host = configService.get('SERVER_HOST') || "http://localhost:5000";
  const port = configService.get('SERVER_PORT') || 5000; // process.env.SERVER_PORT;
  await app.listen(port);
  console.log(`Application is running on port ${port} at ${host} ...`); // await app.getUrl()
}
bootstrap();
