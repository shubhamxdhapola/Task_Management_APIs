import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto/create-task-dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTaskDto } from './dto/update-task-dto/update-task-dto.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Injectable()
export class TasksService {

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly prisma: PrismaService) { }

    async create(data: CreateTaskDto, id: string) {
        const { taskName } = data

        const task = await this.prisma.task.create({
            data: {
                taskName,
                userId: id
            },
            select: {
                id: true,
                taskName: true,
                status: true,
                userId: true
            }
        })
        await this.cacheManager.del('tasks:all')

        return {
            message: "Task created",
            task
        }

    }

    async getTasks(id: string) {
        const tasks = await this.prisma.task.findMany({
            where: { userId: id }
        })
        return tasks
    }

    async update(updates: UpdateTaskDto, taskId: string, userId: string) {

        const updatedTask =
            await this.prisma.task.updateManyAndReturn({
                where: { id: taskId, userId },
                data: {
                    taskName: updates.taskName,
                    status: updates.status
                }
            })

        if (updatedTask.length === 0) {
            throw new NotFoundException(
                "Task not found or you are not authorized to update it"
            )
        }

        return {
            message: "Task updated",
            updatedTask
        }
    }

    async delete(taskId: string, userId: string) {

        const deletedTask = await this.prisma.task.deleteMany({
            where: { id: taskId, userId }
        })

        if (deletedTask.count === 0) {
            throw new NotFoundException(
                "Task not found or you are not authorized to delete it"
            )
        }

        return { message: "Task deleted" }
    }

}
