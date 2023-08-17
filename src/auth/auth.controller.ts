
import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    register(@Body() registerDataDto: RegisterDto) {
        return this.authService.register(registerDataDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    login(@Body() loginDataDto: LoginDto) {
        return this.authService.login(loginDataDto);
    }
}
