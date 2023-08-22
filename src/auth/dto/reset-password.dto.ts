
import {IsEmail, IsNotEmpty, IsString, Matches} from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{6}$/)
    verification_code: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}
