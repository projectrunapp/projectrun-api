
import {Body, Controller, HttpCode, HttpStatus, Post, Put} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {VerificationEmailDto} from "./dto/verification-email.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {MailService} from "../mail/mail.service";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private mailService: MailService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async register(@Body() registerDataDto: RegisterDto):
        Promise<{ success: boolean, message: string }>
    {
        return await this.authService.register(registerDataDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() loginDataDto: LoginDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        return await this.authService.login(loginDataDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("forgot-password")
    async forgotPassword(@Body() verificationEmailDto: VerificationEmailDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        const user = await this.authService.getUserByEmail(verificationEmailDto.email);
        if (!user) {
            return {success: false, message: "User not found!"};
        }

        // TODO: check that user has not exceeded the limit during the last 24 hours

        const verification_code = this.authService.generateVerificationCode();

        await this.mailService.sendVerificationEmail(verificationEmailDto.email, user.name, verification_code);

        await this.authService.saveVerificationCode(user, verification_code);

        return {success: true, message: "Verification code sent successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Put("reset-password")
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        const user = await this.authService.getUserByEmail(resetPasswordDto.email);
        if (!user) {
            return {success: false, message: "User not found!"};
        }
        console.log(user.verification_code, resetPasswordDto.verification_code);
        if (user.verification_code !== resetPasswordDto.verification_code) {
            // TODO: increment the number of failed attempts

            return {success: false, message: "Invalid verification code!"};
        }

        await this.authService.updatePassword(user.id, resetPasswordDto.password);

        return {success: true, message: "Password updated successfully."};
    }
}
