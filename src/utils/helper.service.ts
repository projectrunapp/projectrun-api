
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

    // "WEEK", "MONTH", "YEAR", "ALL"
    getDateRange(currentTimeFrame: string): { start: Date, end: Date } {
        const currentDate = new Date();

        if (currentTimeFrame === "WEEK") {
            // Start of the current week (Sunday)
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

            // End of the current week (Saturday)
            const endOfWeek = new Date(currentDate);
            endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);

            return { start: startOfWeek, end: endOfWeek };
        } else if (currentTimeFrame === "MONTH") {
            // Start of the current month
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            // End of the current month
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            return { start: startOfMonth, end: endOfMonth };
        } else if (currentTimeFrame === "YEAR") {
            // Start of the current year
            const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

            // End of the current year
            const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);

            return { start: startOfYear, end: endOfYear };
        }

        // Start of the year 1970
        const startOfAll = new Date(1970, 0, 1);

        // End of the year 2070
        const endOfAll = new Date(2070, 11, 31, 23, 59, 59, 999);

        return { start: startOfAll, end: endOfAll };
    }

}
