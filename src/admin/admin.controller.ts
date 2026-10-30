import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminGuard } from '../auth/guards/admin/admin.guard.js';
import { AuthenticateGuard } from '../auth/guards/authenticate/authenticate.guard.js';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/admin')
@UseGuards(AuthenticateGuard, AdminGuard)

export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiTags('Admin')
    @ApiCookieAuth('access_token')
    @Get('users')
    async getUsers() {
        return await this.adminService.getUsers()
    }

    @ApiOperation({ summary: 'Get all tasks' })
    @ApiCookieAuth('access_token')
    @Get('tasks')
    async getTasks() {
        return await this.adminService.getTasks()
    }

    @ApiOperation({ summary: 'Get single user' })
    @ApiCookieAuth('access_token')
    @Get('users/:id')
    async getUser(
        @Param('id') id: string,
    ) {
        return await this.adminService.getUser(id)
    }

    @ApiOperation({ summary: 'Get single task' })
    @ApiCookieAuth('access_token')
    @Get('tasks/:id')
    async getTask(
        @Param('id') id: string
    ) {
        return await this.adminService.getTask(id)
    }

    @ApiOperation({ summary: 'Get user tasks' })
    @ApiCookieAuth('access_token')
    @Get('users/:id/tasks')
    async getUserTask(
        @Param('id') id: string
    ) {
        return this.adminService.getUserTask(id)
    }

}
