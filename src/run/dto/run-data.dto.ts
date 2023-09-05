
import {IsArray, IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";

export class RunDataDto {
    /*
    RUN DATA SCHEMA EXAMPLE:
    {
      "run_number": 1,
      "timestamp_started": 1692000000,
      "timestamp_last_updated": 1692000020,
      "coordinates_count": 3,
      "first_coordinate": {
        "lat": 34.1374000,
        "lng": -118.2225000
      },
      "last_coordinate": {
        "lat": 34.1375000,
        "lng": -118.2226000,
        "is_active": true
      },
      "title": "title",
      "pauses_count": 2,
      "distance": 2000,
      "distance_pauses_included": 2500,
      "duration": 5000,
      "duration_pauses_included": 6000,
      "avg_speed": 8.5,
      "avg_speed_pauses_included": 7.5,
      "coordinates": [
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
        },
        ...
        {
          "lat": 34.1375000,
          "lng": -118.2226000,
          "timestamp": 1693001000,
          "is_active": false,
          "pauses_count": 0,
          "distance_piece": 20,
          "distance_total": 2000,
          "distance_total_pauses_included": 2500,
          "duration_piece": 10,
          "duration_total": 5000,
          "duration_total_pauses_included": 6000,
          "avg_speed_piece": 7.9,
          "avg_speed_total": 8.5,
          "avg_speed_total_pauses_included": 7.5
        }
      ]
    },
    */

    @IsNumber()
    @IsNotEmpty()
    run_number: number;

    @IsNumber()
    @IsNotEmpty()
    timestamp_started: number;

    @IsNumber()
    @IsNotEmpty()
    timestamp_last_updated: number;

    @IsNumber()
    @IsNotEmpty()
    coordinates_count: number;

    @IsObject()
    @IsNotEmpty()
    first_coordinate: {
        lat: number,
        lng: number,
    };

    @IsObject()
    @IsNotEmpty()
    last_coordinate: {
        lat: number,
        lng: number,
        is_active: boolean,
    };

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    pauses_count: number;

    @IsNumber()
    @IsNotEmpty()
    distance: number;

    @IsNumber()
    @IsNotEmpty()
    distance_pauses_included: number;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsNumber()
    @IsNotEmpty()
    duration_pauses_included: number;

    @IsNumber()
    @IsNotEmpty()
    avg_speed: number;

    @IsNumber()
    @IsNotEmpty()
    avg_speed_pauses_included: number;

    @IsArray()
    @IsNotEmpty()
    coordinates: {
        lat: number,
        lng: number,
        timestamp: number,
        is_active: boolean,
        pauses_count: number,
        distance_piece: number,
        distance_total: number,
        distance_total_pauses_included: number,
        duration_piece: number,
        duration_total: number,
        duration_total_pauses_included: number,
        avg_speed_piece: number,
        avg_speed_total: number,
        avg_speed_total_pauses_included: number,
    }[];
}
