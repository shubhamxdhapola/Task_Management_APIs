import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports : [RedisModule],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
