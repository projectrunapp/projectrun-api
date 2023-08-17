
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable({})
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getById(id: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: {id},
            select: {id: true, email: true, name: true, createdAt: true}
        });
    }

    async update(id: number, data: {name?: string}): Promise<void> {
        await this.prisma.user.update({
            where: {id},
            data,
        });
    }
}
