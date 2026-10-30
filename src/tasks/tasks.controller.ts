import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task-dto/create-task-dto.js';
import { AuthenticateGuard, type AuthenticatedRequest } from '../auth/guards/authenticate/authenticate.guard.js';
import { UpdateTaskDto } from './dto/update-task-dto/update-task-dto.js';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('/api/tasks')
@UseGuards(AuthenticateGuard)
export class TasksController {

    constructor(private readonly taskService: TasksService) { }

    @ApiCookieAuth('access_token')
    @Post()
    async create(
        @Body() data: CreateTaskDto,
        @Req() req: AuthenticatedRequest
    ) {
        return await this.taskService.create(
            data, req?.user?.id
        )
    }
    @ApiCookieAuth('access_token')
    @Get()
    async getTasks(
        @Req() req: AuthenticatedRequest,
    ) {
        return await this.taskService.getTasks(
            req?.user?.id
        )
    }

    @ApiCookieAuth('access_token')
    @Patch(':id')
    async update(
        @Param('id') taskId: string,
        @Body() data: UpdateTaskDto,
        @Req() req: AuthenticatedRequest
    ) {
        return await this.taskService.update(
            data, taskId, req?.user?.id
        )
    }

    @ApiCookieAuth('access_token')
    @Delete(':id')
    async delete(
        @Param('id') taskId: string,
        @Req() req: AuthenticatedRequest
    ) {
        return await this.taskService.delete(
            taskId, req?.user?.id
        )
    }

}
