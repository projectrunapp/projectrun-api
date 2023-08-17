
import {Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/jwt.guard";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {UserService} from "./user.service";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@GetUser() user: User): Promise<{ success: boolean, data: User }> {
        return {
            success: true,
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean, data: User }> {
        const user = await this.userService.getById(id);
        if (!user) {
            return {
                success: false,
                data: null,
            };
        }

        return {
            success: true,
            data: user,
        };
    }
}
