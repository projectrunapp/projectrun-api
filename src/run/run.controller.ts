
import {
    Controller, UseGuards,
    Delete, Get, Post,
    HttpCode, HttpStatus,
    Param, Query, ParseIntPipe,
} from '@nestjs/common';
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {RunService} from "./run.service";
import {JwtGuard} from "../auth/jwt.guard";

@UseGuards(JwtGuard)
@Controller('run')
export class RunController {
    constructor(private readonly runService: RunService) {}

    @HttpCode(HttpStatus.OK)
    @Get('my-runs')
    async getMyRuns(@GetUser() user: User, @Query() query: {
        interval?: string,
        page?: number,
        per_page?: number,
        order?: string,
    }): Promise<{ success: boolean, message: string, data?: any[] }>
    {
        // TODO: validate query parameters
        const paginationData = await this.runService.getRuns(user.id, {
            interval: query.interval || "ALL",
            page: query.page || 1,
            per_page: query.per_page ? Math.min(query.per_page, 50) : 10,
            order: query.order === "desc" ? "desc" : "asc",
        });

        return {
            success: true,
            message: "Runs retrieved successfully.",
            data: paginationData,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Delete('delete/:runId')
    async deleteRun(@GetUser() user: User, @Param('runId', ParseIntPipe) runId: number):
        Promise<{ success: boolean, message: string }>
    {
        const run = await this.runService.getRun(user.id, runId);
        if (!run) {
            return {success: false, message: "Run not found!"};
        } else if (!run.datetime_end) {
            return {success: false, message: "Run is active!"};
        }

        await this.runService.delete(user.id, runId);

        return {success: true, message: "Run deleted successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Post('start')
    async startRun(@GetUser() user: User):
        Promise<{ success: boolean, message: string }>
    {
        const activeRun = await this.runService.getActiveRun(user.id);
        if (activeRun) {
            return {success: false, message: "You already have an active run!"};
        }

        const run = await this.runService.start(user.id);

        return {success: true, message: `${run.title} started successfully.`};
    }

    @HttpCode(HttpStatus.OK)
    @Post('pause/:runId')
    async pauseRun(@GetUser() user: User, @Param('runId', ParseIntPipe) runId: number):
        Promise<{ success: boolean, message: string }>
    {
        const run = await this.runService.getRun(user.id, runId);
        if (!run) {
            return {success: false, message: "Run not found!"};
        } else if (run.datetime_end) {
            return {success: false, message: "Run finished!"};
        }

        await this.runService.pause(user.id, runId);

        return {success: true, message: "Run paused successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Post('resume/:runId')
    async resumeRun(@GetUser() user: User, @Param('runId', ParseIntPipe) runId: number):
        Promise<{ success: boolean, message: string }>
    {
        const run = await this.runService.getRun(user.id, runId);
        if (!run) {
            return {success: false, message: "Run not found!"};
        } else if (run.datetime_end) {
            return {success: false, message: "Run finished!"};
        }

        await this.runService.resume(user.id, runId);

        return {success: true, message: "Run resumed successfully."};
    }

    @HttpCode(HttpStatus.OK)
    @Post('finish/:runId')
    async finishRun(@GetUser() user: User, @Param('runId', ParseIntPipe) runId: number):
        Promise<{ success: boolean, message: string }>
    {
        const run = await this.runService.getRun(user.id, runId);
        if (!run) {
            return {success: false, message: "Run not found!"};
        } else if (run.datetime_end) {
            return {success: false, message: "Run already finished!"};
        }

        await this.runService.finish(user.id, runId);

        return {success: true, message: "Run finished successfully."};
    }
}
