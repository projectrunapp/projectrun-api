
import { Module } from '@nestjs/common';
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { RunModule } from './run/run.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import {FriendshipModule} from "./friendship/friendship.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    FriendshipModule,
    RunModule,
    PrismaModule,
  ],
})
export class AppModule {}
