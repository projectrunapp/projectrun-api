
import { Module } from '@nestjs/common';
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { RunModule } from './run/run.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import {FriendshipModule} from "./friendship/friendship.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "path";
import {MailModule} from "./mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MailModule,
    AuthModule,
    UserModule,
    FriendshipModule,
    RunModule,
    PrismaModule,
  ],
})
export class AppModule {}
