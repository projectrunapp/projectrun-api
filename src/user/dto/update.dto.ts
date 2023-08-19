
import {IsIn, IsOptional, IsString, Matches} from "class-validator";

export class UpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @Matches(/^(?=.{4,20}$)(?:[a-z\d]+(?:(?:\.|_)[a-z\d])*)+$/)
    username: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    birth_date: string;

    @IsOptional()
    @IsString()
    @IsIn(["unknown", "male", "female", "other"]) // TODO: make this an enum
    gender: string;
}
