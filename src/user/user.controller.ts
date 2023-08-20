
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
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
    async getMe(@GetUser() user: User):
        Promise<{ success: boolean, message: string, data: User }>
    {
        return {
            success: true,
            message: "User found successfully.",
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('search')
    async search(@GetUser() user: User, @Query() query: { term: string }):
        Promise<{ success: boolean, message: string, data?: User[] }>
    {
        if (!query.term || query.term.length < 3) {
            return {
                success: false,
                message: "Search term must be at least 3 characters long."
            };
        }

        const users = await this.userService.search(user.id, query.term);

        return {
            success: true,
            message: "Users found successfully.",
            data: users,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('profile/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number):
        Promise<{ success: boolean, message: string, data: User }>
    {
        const user = await this.userService.getUserById(id);

        return {
            success: true,
            message: "User found successfully.",
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Put('profile')
    async update(@GetUser() user: User, @Body() updateUserDto: UpdateDto):
        Promise<{ success: boolean, message: string }>
    {
        if (updateUserDto.username) {
            const userWithUsername = await this.userService.getByUsername(updateUserDto.username);
            if (userWithUsername && userWithUsername.id !== user.id) {
                return {
                    success: false,
                    message: "Username already taken!",
                };
            }
        }

        await this.userService.update(user.id, updateUserDto);

        return {
            success: true,
            message: "User updated successfully.",
        };
    }
}
