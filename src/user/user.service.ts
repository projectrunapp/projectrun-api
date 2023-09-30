
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable({})
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserById(id: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true, createdAt: true, avatar: true,
                email: true, name: true, username: true, gender: true, birth_date: true,
            }
        });
    }

    async getUserRunsCount(id: number): Promise<any> {
        return this.prisma.run.count({
            where: {userId: id},
        });
    }
    async getUserRunsDistance(id: number): Promise<any> {
        return this.prisma.run.aggregate({
            where: {userId: id},
            _sum: {
                distance: true,
            }
        });
    }

    async getUserFriendsCount(id: number): Promise<any> {
        return this.prisma.friendship.count({
            where: {
                OR: [{
                    senderId: id,
                    status: 'ACCEPTED',
                }, {
                    receiverId: id,
                    status: 'ACCEPTED',
                }],
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

    async update(id: number, data: {
        name?: string,
        username?: string,
        birth_date?: string,
        gender?: string
    }): Promise<void> {
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
