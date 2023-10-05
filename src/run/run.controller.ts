
import {
    Controller, UseGuards,
    Delete, Get, Post,
    HttpCode, HttpStatus,
    Param, Query, ParseIntPipe, Body,
} from '@nestjs/common';
import {GetUser} from "../auth/get-user.decorator";
import {User} from "@prisma/client";
import {RunService} from "./run.service";
import {JwtGuard} from "../auth/jwt.guard";
import {SyncRunsDataDto} from "./dto/sync-runs-data.dto";

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
    @Get('runs-by-time/:id')
    async getRunsByTime(@Param('id', ParseIntPipe) id: number, @Query() query: {
        interval?: string,
    }): Promise<{ success: boolean, message: string, data?: any[] }>
    {
        // TODO: validate query parameters
        const runData = await this.runService.getRunsByTime(id, query.interval || "ALL");

        return {
            success: true,
            message: "Runs retrieved successfully.",
            data: runData,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Get('my-runs/:runId')
    async getMyRun(@GetUser() user: User, @Param('runId', ParseIntPipe) runId: number):
        Promise<{ success: boolean, message: string, data?: any }>
    {
        const run = await this.runService.getRun(user.id, runId);
        if (!run) {
            return {success: false, message: "Run not found!"};
        }

        return {
            success: true,
            message: "Run retrieved successfully.",
            data: run,
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
    @Post('sync')
    async sync(@GetUser() user: User, @Body() syncRunsDataDto: SyncRunsDataDto): Promise<{ success: boolean, message: string }>
    {
        // loop through the runs and save them to the database
        for (const runData of syncRunsDataDto.runs_data) {
            await this.runService.createRun(user.id, runData);
        }

        return {success: true, message: "Synced successfully."};
    }
}
