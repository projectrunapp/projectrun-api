
import {IsEmail, IsIn, IsNotEmpty, IsString, Matches} from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.{4,20}$)(?:[a-z\d]+(?:(?:\.|_)[a-z\d])*)+$/)
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
