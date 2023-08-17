
import { Module } from '@nestjs/common';
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { RunModule } from './run/run.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    RunModule,
    PrismaModule,
  ],
})
export class AppModule {}
