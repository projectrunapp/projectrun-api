
import { Injectable } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            // log: ['query', 'info', 'warn'],
            datasources: {
                db: {
                    url: config.get('DB_URL') // process.env.DB_URL,
                }
            }
        });
    }
}
