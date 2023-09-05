
import {IsNotEmpty, IsNumber} from "class-validator";

// TODO: review this DTO and delete if not needed
export class CoordinateDto {
    /*
    COORDINATE SCHEMA EXAMPLE:
    {
      "lat": 34.1374000,
      "lng": -118.2225000,
      "timestamp": 1693000000,
      "is_active": true,
      "pauses_count": 0,
      "distance_piece": 0,
      "distance_total": 0,
      "distance_total_pauses_included": 0,
      "duration_piece": 0,
      "duration_total": 0,
      "duration_total_pauses_included": 0,
      "avg_speed_piece": 0,
      "avg_speed_total": 0,
      "avg_speed_total_pauses_included": 0
    }
    */

    @IsNotEmpty()
    lat: number;

    @IsNotEmpty()
    lng: number;

    @IsNumber()
    @IsNotEmpty()
    timestamp: number;

    @IsNotEmpty()
    is_active: boolean;

    @IsNumber()
    @IsNotEmpty()
    pauses_count: number;

    @IsNumber()
    @IsNotEmpty()
    distance_piece: number;

    @IsNumber()
    @IsNotEmpty()
    distance_total: number;

    @IsNumber()
    @IsNotEmpty()
    distance_total_pauses_included: number;

    @IsNumber()
    @IsNotEmpty()
    duration_piece: number;

    @IsNumber()
    @IsNotEmpty()
    duration_total: number;

    @IsNumber()
    @IsNotEmpty()
    duration_total_pauses_included: number;

    @IsNumber()
    @IsNotEmpty()
    avg_speed_piece: number;

    @IsNumber()
    @IsNotEmpty()
    avg_speed_total: number;

    @IsNumber()
    @IsNotEmpty()
    avg_speed_total_pauses_included: number;
}
