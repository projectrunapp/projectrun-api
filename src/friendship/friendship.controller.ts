
import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import {JwtGuard} from "../auth/jwt.guard";
import {GetUser} from "../auth/get-user.decorator";
import {EnumRelationshipStatus, User} from "@prisma/client";
import {FriendshipService} from "./friendship.service";

@UseGuards(JwtGuard)
@Controller('friendship')
export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) {}

    @HttpCode(HttpStatus.OK)
    @Get('get-friend-requests')
    async getFriendRequests(@GetUser() user: User, @Query() query: { filter?: string }):
        Promise<{ success: boolean, message: string, data?: any[] }>
    {
        const friendRequests = await this.friendshipService.getFriendRequests(user.id, query.filter);

        return {
            success: true,
            message: "Friend requests retrieved successfully.",
            data: friendRequests,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('get-friends')
    async getFriends(@GetUser() user: User):
        Promise<{ success: boolean, message: string, data?: any[] }>
    {
        const friends = await this.friendshipService.getFriends(user.id);

        return {
            success: true,
            message: "Friends retrieved successfully.",
            data: friends,
        };
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('send-friend-request/:receiverId')
    async sendFriendRequest(@GetUser() user: User, @Param('receiverId', ParseIntPipe) receiverId: number):
        Promise<{ success: boolean, message: string }>
    {
        if (user.id === receiverId) {
            return {success: false, message: "You cannot send a friend request to yourself!"};
        }

        const receiver = await this.friendshipService.getUserById(receiverId);
        if (!receiver) {
            return {success: false, message: "Receiver not found!"};
        }

        const relationship = await this.friendshipService.getRelationship(user.id, receiverId);
        if (relationship) {
            return {success: false, message: "You are already friends with this user!"};
        }

        await this.friendshipService.sendFriendRequest(user.id, receiverId);

        return {success: true, message: "Friend request sent successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Delete('cancel-friend-request/:receiverId')
    async cancelFriendRequest(@GetUser() user: User, @Param('receiverId', ParseIntPipe) receiverId: number):
        Promise<{ success: boolean, message: string }>
    {
        if (user.id === receiverId) {
            return {success: false, message: "You cannot cancel a friend request to yourself!"};
        }

        const receiver = await this.friendshipService.getUserById(receiverId);
        if (!receiver) {
            return {success: false, message: "Receiver not found!"};
        }

        const relationship = await this.friendshipService.getRelationship(user.id, receiverId);
        if (!relationship || relationship.status !== EnumRelationshipStatus.PENDING) {
            return {success: false, message: "You are not friends with this user!"};
        }

        await this.friendshipService.cancelFriendRequest(user.id, receiverId);

        return {success: true, message: "Friend request cancelled successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Put('accept-friend-request/:senderId')
    async acceptFriendRequest(@GetUser() user: User, @Param('senderId', ParseIntPipe) senderId: number):
        Promise<{ success: boolean, message: string }>
    {
        if (user.id === senderId) {
            return {success: false, message: "You cannot accept a friend request to yourself!"};
        }

        const sender = await this.friendshipService.getUserById(senderId);
        if (!sender) {
            return {success: false, message: "Sender not found!"};
        }

        const relationship = await this.friendshipService.getRelationship(user.id, senderId);
        if (!relationship || relationship.status !== EnumRelationshipStatus.PENDING) {
            return {success: false, message: "You are not friends with this user!"};
        }

        await this.friendshipService.acceptFriendRequest(user.id, senderId);

        return {success: true, message: "Friend request accepted successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Delete('decline-friend-request/:senderId')
    async declineFriendRequest(@GetUser() user: User, @Param('senderId', ParseIntPipe) senderId: number):
        Promise<{ success: boolean, message: string }>
    {
        if (user.id === senderId) {
            return {success: false, message: "You cannot decline a friend request to yourself!"};
        }

        const sender = await this.friendshipService.getUserById(senderId);
        if (!sender) {
            return {success: false, message: "Sender not found!"};
        }

        const relationship = await this.friendshipService.getRelationship(user.id, senderId);
        if (!relationship || relationship.status !== EnumRelationshipStatus.PENDING) {
            return {success: false, message: "You are not friends with this user!"};
        }

        await this.friendshipService.declineFriendRequest(user.id, senderId);

        return {success: true, message: "Friend request declined successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Delete('unfriend/:friendId')
    async unfriend(@GetUser() user: User, @Param('friendId', ParseIntPipe) friendId: number):
        Promise<{ success: boolean, message: string }>
    {
        if (user.id === friendId) {
            return {success: false, message: "You cannot unfriend yourself!"};
        }

        const friend = await this.friendshipService.getUserById(friendId);
        if (!friend) {
            return {success: false, message: "Friend not found!"};
        }

        const relationship = await this.friendshipService.getRelationship(user.id, friendId);
        if (!relationship || relationship.status !== EnumRelationshipStatus.ACCEPTED) {
            return {success: false, message: "You are not friends with this user!"};
        }

        await this.friendshipService.removeFriend(user.id, friendId); // unfriend

        return {success: true, message: "Unfriended successfully."}
    }
}
