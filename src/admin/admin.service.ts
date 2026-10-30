import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Injectable()
export class AdminService {

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly prisma: PrismaService,
    ) { }

    async getUsers() {
        const cachedUsers = await this.cacheManager.get("users:all")
        if (cachedUsers !== null && cachedUsers !== undefined) {
            console.log("Cache hit")
            return cachedUsers
        }
        console.log("Cache miss")

        const users = await this.prisma.user.findMany({
            where: { role: { not: 'ADMIN' } }
        });

        await this.cacheManager.set(
            'users:all',
            users,
            600_000
        )
        return users
    }

    async getTasks() {
        const cachedTasks = await this.cacheManager.get("tasks:all")
        if (cachedTasks !== null && cachedTasks !== undefined) {
            console.log("Cache hit")
            return cachedTasks
        }
        console.log("Cache miss")

        const tasks = await this.prisma.task.findMany();

        await this.cacheManager.set(
            'tasks:all',
            tasks,
            600_000
        )

        return tasks
    }


    async getUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                role: true,
                tasks: true
            }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user
    }

    async getTask(id: string) {
        const task = await this.prisma.task.findUnique({ where: { id } })
        if (!task) {
            throw new NotFoundException("Task not found")
        }
        return task
    }

    async getUserTask(userId: string) {
        const tasks = await this.prisma.task.findMany({
            where: { userId }
        })
        return tasks
    }
}
