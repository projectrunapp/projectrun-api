
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

    async getFriends(id: number): Promise<any> {
        return this.prisma.friendship.findMany({
            where: {
                OR: [{
                    senderId: id,
                    status: 'ACCEPTED',
                }, {
                    receiverId: id,
                    status: 'ACCEPTED',
                }],
            },
            select: {
                id: true,
                status: true,
                sender: {
                    select: {id: true, name: true, email: true, username: true},
                },
                receiver: {
                    select: {id: true, name: true, email: true, username: true},
                },
            },
        });
    }

    async getRelationship(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.findFirst({
            where: {
                OR: [{
                    senderId,
                    receiverId,
                }, {
                    senderId: receiverId,
                    receiverId: senderId,
                }],
            },
        });
    }

    async getFriendRequests(id: number, filter: string): Promise<any> {
        return this.prisma.friendship.findMany({
            where: {
                [filter === 'sent' ? 'senderId' : 'receiverId']: id, // received or sent (default: received)
                status: 'PENDING',
            },
            select: {
                id: true,
                status: true,
                [filter === 'sent' ? 'receiver' : 'sender']: {
                    select: {id: true, name: true, email: true, username: true}
                },
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
                OR: [{
                    senderId,
                    receiverId,
                }, {
                    senderId: receiverId,
                    receiverId: senderId,
                }],
            },
        });
    }

    async acceptFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.updateMany({
            where: {
                OR: [{
                    senderId,
                    receiverId,
                }, {
                    senderId: receiverId,
                    receiverId: senderId,
                }],
            },
            data: {
                status: 'ACCEPTED',
            },
        });
    }

    async declineFriendRequest(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.deleteMany({
            where: {
                OR: [{
                    senderId,
                    receiverId,
                }, {
                    senderId: receiverId,
                    receiverId: senderId,
                }],
            },
        });
    }

    async removeFriend(senderId: number, receiverId: number): Promise<any> {
        return this.prisma.friendship.deleteMany({
            where: {
                OR: [{
                    senderId,
                    receiverId,
                }, {
                    senderId: receiverId,
                    receiverId: senderId,
                }],
            },
        });
    }

    async search(authUserId: number, term: string): Promise<any> {
        return this.prisma.user.findMany({
            where: {
                id: {not: authUserId},
                OR: [{
                    name: {contains: term, mode: 'insensitive'},
                }, {
                    username: {contains: term, mode: 'insensitive'}
                }, {
                    email: {contains: term, mode: 'insensitive'}
                }],
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                sent: {
                    select: {id: true, status: true, senderId: true, receiverId: true},
                    where: {receiverId: authUserId},
                },
                received: {
                    select: {id: true, status: true, senderId: true, receiverId: true},
                    where: {senderId: authUserId},
                },
            },
        });
    }
}
