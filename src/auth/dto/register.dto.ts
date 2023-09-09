
import {IsEmail, IsIn, IsNotEmpty, IsString, Matches} from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9\_]{4,20}$/) // example: john_doe123
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    // TODO: replace ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$
    @Matches(/^.{8,20}$/)
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) // example: 2000-01-01
    birth_date: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["unknown", "male", "female", "other"])
    gender: string;
}
