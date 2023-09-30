
import {
    Body, Param, ParseIntPipe,
    HttpCode, HttpStatus,
    Controller, UseGuards,
    Get, Put,
    UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {JwtGuard} from "../auth/jwt.guard";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {UserService} from "./user.service";
import {HelperService} from "../utils/helper.service";
import {UpdateDto} from "./dto/update.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import * as path from "path";
import {diskStorage} from "multer";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly helperService: HelperService) {}

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@GetUser() user: User):
        Promise<{ success: boolean, message: string, data: User }>
    {
        const me = await this.userService.getUserById(user.id);

        return {
            success: true,
            message: "User found successfully.",
            data: me,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('profile/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number):
        Promise<{ success: boolean, message: string, data?: User }>
    {
        const user = await this.userService.getUserById(id);
        if (!user) {
            return {success: false, message: "User not found!"};
        }

        const userRunsCount = await this.userService.getUserRunsCount(user.id);

        const userRunsDistance = await this.userService.getUserRunsDistance(user.id);
        const humanizedDistance = this.helperService.humanizedDistance(userRunsDistance._sum.distance);

        const userFriendsCount = await this.userService.getUserFriendsCount(user.id);

        return {
            success: true,
            message: "User found successfully.",
            data: {
                ...user,
                runs_count: userRunsCount,
                runs_distance: humanizedDistance,
                friends_count: userFriendsCount,
            },
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
    async imageUpload(@GetUser() user: User, @UploadedFile() avatar: Express.Multer.File): Promise<{
        success: boolean,
        message: string,
        avatar?: string,
    }> {
        if (!avatar) {
            // HttpStatus.INTERNAL_SERVER_ERROR
            return {success: false, message: "Image upload failed!"};
        }

        // TODO: later upload to cloud storage
        const avatarUrl = `${process.env.SERVER_HOST}/uploads/avatars/${avatar.filename}`;
        await this.userService.updateAvatar(user.id, avatarUrl);

        return {
            success: true,
            message: "Image uploaded successfully.",
            avatar: avatarUrl,
        };
    }
}
