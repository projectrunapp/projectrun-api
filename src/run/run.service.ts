
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {RunDataDto} from "./dto/run-data.dto";
import {HelperService} from "../utils/helper.service";

@Injectable({})
export class RunService {
    constructor(private prisma: PrismaService,
                private readonly helperService: HelperService) {}

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
        const {start, end} = this.helperService.getDateRange(interval);
        const where = {
            userId: id,
            started_at: {gte: start.toISOString(), lte: end.toISOString()},
        };

        const count = await this.prisma.run.count({ where });

        if (count === 0) {
            return {total: 0, pages: 0, runs: []}
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

    async getRunsByTime(userId: number, interval: string): Promise<any> {
        const {start, end} = this.helperService.getDateRange(interval);
        const where = {
            userId: userId,
            started_at: {gte: start.toISOString(), lte: end.toISOString()}
        };

        const runs = await this.prisma.run.findMany({ where });

        const runsByTimeFrame = {};
        for (const run of runs) {
            let dateSplit = run.started_at.toISOString().split("T")[0];
            let date: string;

            switch (interval) {
                case "WEEK": case "MONTH":
                    date = dateSplit.slice(0, 10);
                    break;
                case "YEAR":
                    date = dateSplit.slice(0, 7);
                    break;
                default: // "ALL"
                    date = dateSplit.slice(0, 4);
                    break;
            }

            if (!runsByTimeFrame[date]) {
                runsByTimeFrame[date] = {runs_count: 0, distance: 0, duration: 0};
            }
            runsByTimeFrame[date].runs_count++;
            runsByTimeFrame[date].distance += run.distance;
            runsByTimeFrame[date].duration += run.duration;
        }

        return runsByTimeFrame;
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
