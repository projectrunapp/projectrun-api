
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class GoogleSignInDto {
    @IsString()
    @IsNotEmpty()
    idToken: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    familyName: string;

    @IsString()
    @IsNotEmpty()
    givenName: string;

    // @IsString()
    // @IsNotEmpty()
    // id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    photo: string;
}
