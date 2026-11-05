import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports : [RedisModule],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule {}
