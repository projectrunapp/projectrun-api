
import {IsIn, IsNotEmpty, IsString} from "class-validator";

export class CreateDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(["unknown", "sunny", "cloudy", "rainy", "snowy", "windy", "foggy", "stormy"]) // TODO: make this an enum
    weather: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["unknown", "road", "trail", "track", "treadmill"]) // TODO: make this an enum
    terrain: string;

    @IsString()
    @IsNotEmpty()
    location_start: string;
}
