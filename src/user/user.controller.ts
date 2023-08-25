
import {
    Body, Param, ParseIntPipe,
    HttpCode, HttpStatus,
    Controller, UseGuards,
    Get, Put,
    Query, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {JwtGuard} from "../auth/jwt.guard";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {UserService} from "./user.service";
import {UpdateDto} from "./dto/update.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import * as path from "path";
import {diskStorage} from "multer";

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

    // TODO: add myProfile endpoint

    @HttpCode(HttpStatus.OK)
    @Get('search')
    async search(@GetUser() user: User, @Query() query: { term: string }):
        Promise<{ success: boolean, message: string, data?: User[] }>
    {
        if (!query.term || query.term.length < 3) {
            return {success: false, message: "Search term must be at least 3 characters long."};
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
                return {success: false, message: "Username already taken!"};
            }
        }

        await this.userService.update(user.id, updateUserDto);

        return {success: true, message: "User updated successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Put('avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: path.join(__dirname, '..', '..', 'uploads', 'avatars'),
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(file.originalname);
                    cb(null, `${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                console.log(!file.originalname.match(/\.(jpg|jpeg|png)$/));
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    // HttpStatus.BAD_REQUEST
                    cb(new Error("Only .jpg, .jpeg, and .png images are allowed!"), false);
                } else {
                    cb(null, true);
                }
            },
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB
            },
        }),
    )
    async imageUpload(@GetUser() user: User, @UploadedFile() avatar: Express.Multer.File):
        Promise<{ success: boolean, message: string, avatar?: string }>
    {
        if (!avatar) {
            // HttpStatus.INTERNAL_SERVER_ERROR
            return {success: false, message: "Image upload failed!"};
        }

        await this.userService.updateAvatar(user.id, avatar.filename);

        return {
            success: true,
            message: "Image uploaded successfully.",
            avatar: avatar.filename,
        };
    }
}
