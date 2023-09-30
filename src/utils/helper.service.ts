
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    constructor() {}

    humanizedDistance(distanceInMeters: number): string {
        if (distanceInMeters < 1000) {
            return `${distanceInMeters} m`;
        } else {
            return `${(distanceInMeters / 1000).toFixed(2)} km`;
        }
    }

}
