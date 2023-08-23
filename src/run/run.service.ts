
import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

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
                calories_burned: true,
                datetime_start: true,
                datetime_end: true,
                distance: true,
                duration: true,
                elevation_gain: true,
                heart_rate_avg: true,
                location_end: true,
                location_start: true,
                notes: true,
                pace_avg: true,
                temperature: true,
                terrain: true,
                weather: true,
            },
        });
    }

    async getRuns(id: number, {interval, page, per_page, order}): Promise<any> {
        const where = {
            userId: id,
        };
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
            orderBy: {createdAt: order},
            select: {
                id: true, title: true, distance: true, pace_avg: true, duration: true,
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

    async getActiveRun(id: number): Promise<any> {
        return this.prisma.run.findFirst({
            where: {
                user: {
                    id: id,
                },
                datetime_end: null,
            },
            select: {
                id: true,
                title: true,
            },
        });
    }

    async delete(userId: number, runId: number): Promise<any> {
        return this.prisma.run.delete({
            where: {
                id: runId,
                userId: userId,
            },
        });
    }

    async start(id: number): Promise<any> {
        const nowDayTime = new Date().getHours();
        let title = "Run";
        if (nowDayTime >= 5 && nowDayTime < 12) {
            title = `Morning ${title}`;
        } else if (nowDayTime >= 12 && nowDayTime < 18) {
            title = `Afternoon ${title}`;
        } else if (nowDayTime >= 18 && nowDayTime < 22) {
            title = `Evening ${title}`;
        } else {
            title = `Night ${title}`;
        }

        return this.prisma.run.create({
            data: {
                title: title,
                weather: "unknown",
                terrain: "unknown",
                location_start: "unknown",
                user: {
                    connect: {
                        id: id,
                    },
                },
            },
            select: {
                id: true,
                title: true,
            }
        });
    }

    async pause(id: number, runId: number): Promise<any> {
        // TODO: Implement pause
        return true;
    }

    async resume(id: number, runId: number): Promise<any> {
        // TODO: Implement resume
        return true;
    }

    async finish(id: number, runId: number): Promise<any> {
        return this.prisma.run.update({
            where: {
                id: runId,
                userId: id,
            },
            data: {
                datetime_end: new Date().toISOString(),
            },
        });
    }
}
