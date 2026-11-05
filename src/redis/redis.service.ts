import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {

    private readonly redis: Redis

    constructor(private readonly configService: ConfigService) {
        const redisUrl =
            this.configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379'
        const username = this.configService.get<string>('REDIS_USERNAME')
        const password = this.configService.get<string>('REDIS_PASSWORD')

        this.redis = new Redis(redisUrl, {
            protocol: 3,
            username: username,
            password: password,
        })

        this.redis.on('connect', () => {
            console.log("Redis connected")
        })

        this.redis.on('error', (error) => {
            console.error("Error in redis connection : ", error)
        })
    }

    async set(key: string, value: unknown, ttl?: number) {
        const jsonValue = JSON.stringify(value)

        if (ttl !== undefined) {
            return this.redis.set(key, jsonValue, 'EX', ttl)
        }

        return this.redis.set(key, jsonValue)
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key)
        if (!value) {
            return null
        }
        return JSON.parse(value) as T
    }

    async delete(key : string) {
        return this.redis.del(key);
    }

    async onModuleDestroy() {
        await this.redis.quit()
        console.log("Redis connection closed")
    }
}
