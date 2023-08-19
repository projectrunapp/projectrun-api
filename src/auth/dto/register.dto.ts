
import {IsEmail, IsIn, IsNotEmpty, IsString, Matches} from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    birth_date: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["unknown", "male", "female", "other"])
    gender: string;
}
