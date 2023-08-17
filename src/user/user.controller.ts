
import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/jwt.guard";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {UserService} from "./user.service";
import {UpdateDto} from "./dto/update.dto";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@GetUser() user: User): Promise<{ success: boolean, message: string, data?: User }> {
        return {
            success: true,
            message: 'User found successfully.',
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean, message: string, data?: User }> {
        const user = await this.userService.getById(id);
        if (!user) {
            return {
                success: false,
                message: 'User not found!',
                data: null,
            };
        }

        return {
            success: true,
            message: 'User found successfully.',
            data: user,
        };
    }

    @Put()
    async update(@GetUser() user: User, @Body() updateUserDto: UpdateDto): Promise<{ success: boolean, message: string }> {
        await this.userService.update(user.id, updateUserDto);

        return {
            success: true,
            message: 'User updated successfully.',
        };
    }
}
