import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {

    constructor(private readonly prisma: PrismaService) { }

    async getUsers() {
        return await this.prisma.user.findMany({
            where: { role: { not: 'ADMIN' } }
        });
    }

    async getTasks() {
        return await this.prisma.task.findMany();
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
