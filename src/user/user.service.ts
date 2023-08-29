
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable({})
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserById(id: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true, createdAt: true,
                email: true, name: true, username: true, gender: true, birth_date: true,
            }
        });
    }

    async search(id: number, term: string): Promise<any> {
        return this.prisma.user.findMany({
            where: {
                id: {
                    not: id,
                },
                OR: [
                    {
                        name: {
                            contains: term,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: term,
                            mode: 'insensitive',
                        }
                    },
                    {
                        email: {
                            contains: term,
                            mode: 'insensitive',
                        }
                    },
                ],
            },
            select: {
                id: true, createdAt: true,
                name: true, username: true, email: true,
            },
        });
    }

    async getByUsername(username: string): Promise<any> {
        return this.prisma.user.findUnique({
            where: {username},
            select: {
                id: true, createdAt: true,
                email: true, name: true, username: true, gender: true, birth_date: true,
            }
        });
    }

    async update(id: number, data: {name?: string}): Promise<void> {
        await this.prisma.user.update({
            where: {id},
            data,
        });
    }

    async updateAvatar(id: number, avatar: string): Promise<void> {
        await this.prisma.user.update({
            where: {id},
            data: {avatar},
        });
    }
}
