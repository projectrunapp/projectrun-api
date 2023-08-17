
import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async register(@Body() registerDataDto: RegisterDto): Promise<{ success: boolean, message: string }> {
        return await this.authService.register(registerDataDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() loginDataDto: LoginDto): Promise<{ success: boolean, message: string, data?: any }> {
        return await this.authService.login(loginDataDto);
    }
}
