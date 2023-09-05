
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {RunDataDto} from "./dto/run-data.dto";

@Injectable({})
export class RunService {
    constructor(private prisma: PrismaService) {}

    async getRun(id: number, runId: number): Promise<any> {
        return this.prisma.run.findFirst({
            where: {
                user: {
                    id: id,
                },
                id: runId,
            },
            select: {
                id: true,
                title: true,
                started_at: true,
                completed_at: true,
                distance: true,
                duration: true,
                avg_speed: true,
                coordinates: true,
            },
        });
    }

    async getRuns(id: number, {interval, page, per_page, order}): Promise<any> {
        const where = {
            userId: id,
        };
        // TODO: get as enum
        const intervalValues = ["WEEK", "MONTH", "LAST_3_MONTHS", "LAST_6_MONTHS", "LAST_YEAR"];
        if (interval && intervalValues.includes(interval)) {
            const date = new Date();
            switch (interval) {
                case "WEEK":
                    date.setDate(date.getDate() - 7);
                    break;
                case "MONTH":
                    date.setMonth(date.getMonth() - 1);
                    break;
                case "LAST_3_MONTHS":
                    date.setMonth(date.getMonth() - 3);
                    break;
                case "LAST_6_MONTHS":
                    date.setMonth(date.getMonth() - 6);
                    break;
                case "LAST_YEAR":
                    date.setFullYear(date.getFullYear() - 1);
                    break;
                default:
                    break;
            }
            where["createdAt"] = {
                gte: date.toISOString(),
            };
        }

        const count = await this.prisma.run.count({
            where,
        });

        if (count === 0) {
            return {
                total: 0,
                pages: 0,
                runs: [],
            }
        }

        const runs = await this.prisma.run.findMany({
            where,
            orderBy: {id: order}, // createdAt
            select: {
                id: true,
                title: true,
                started_at: true,
                completed_at: true,
                distance: true,
                duration: true,
                avg_speed: true,
            },
            skip: (page - 1) * per_page,
            take: per_page,
        });

        return {
            total: count,
            pages: Math.ceil(count / per_page),
            runs,
        }
    }

    async delete(userId: number, runId: number): Promise<any> {
        return this.prisma.run.delete({
            where: {
                id: runId,
                userId: userId,
            },
        });
    }

    async createRun(userId: number, runData: RunDataDto): Promise<any> {
        return this.prisma.run.create({
            data: {
                // user: {
                //     connect: {
                //         id: userId,
                //     },
                // },
                userId: userId,
                // calories_burned: 0,
                // elevation_gain: 0,
                // heart_rate_avg: 0,
                // temperature: 0,
                // terrain: 'unknown',
                // weather: 'unknown',
                // notes: '',
                title: runData.title,
                started_at: new Date(runData.timestamp_started * 1000),
                completed_at: new Date(runData.timestamp_last_updated * 1000),
                coordinates_count: runData.coordinates_count,
                first_coordinate_lat: runData.first_coordinate.lat,
                first_coordinate_lng: runData.first_coordinate.lng,
                last_coordinate_lat: runData.last_coordinate.lat,
                last_coordinate_lng: runData.last_coordinate.lng,
                pauses_count: runData.pauses_count,
                distance: runData.distance,
                distance_pauses_included: runData.distance_pauses_included,
                duration: runData.duration,
                duration_pauses_included: runData.duration_pauses_included,
                avg_speed: runData.avg_speed,
                avg_speed_pauses_included: runData.avg_speed_pauses_included,
                coordinates: JSON.stringify(runData.coordinates),
            },
        });
    }
}
