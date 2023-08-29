
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable({})
export class FriendshipService {
    constructor(private prisma: PrismaService) {}

    async getUserById(id: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: {id},
        });
    }

    async getFriendRequests(id: number, filter: string): Promise<any> {
        return this.prisma.friendship.findMany({
            where: {
                receiverId: id,
                status: 'PENDING',
            },
            select: {
                id: true,
                status: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getFriends(id: number): Promise<any> {
        return this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: id,
                        status: 'ACCEPTED',
                    },
                    {
                        receiverId: id,
                        status: 'ACCEPTED',
                    },
                ],
            },
            select: {
                id: true,
                status: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getRelationship(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.findFirst({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            },
        });
    }

    async sendFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.create({
            data: {
                senderId,
                receiverId,
                status: 'PENDING',
            },
        });
    }

    async cancelFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.deleteMany({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            },
        });
    }

    async acceptFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.updateMany({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            },
            data: {
                status: 'ACCEPTED',
            },
        });
    }

    async declineFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.deleteMany({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            },
        });
    }

    async removeFriend(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.deleteMany({
            where: {
                OR: [
                    {
                        senderId,
                        receiverId,
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId,
                    },
                ],
            },
        });
    }
}
