import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register-dto/register-dto.js';
import bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto/login-dto.js';
import { JwtPayload } from '../types/types.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Injectable()
export class AuthService {

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async register(data: RegisterDto) {
        const { name, email, password, imageUrl, imagePublicId } = data

        const existingUser =
            await this.prisma.user.findUnique({
                where: { email }
            })

        if (existingUser) {
            throw new ConflictException("Email already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                imageUrl,
                imagePublicId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                imageUrl: true,
                createdAt: true,
            }
        })
        await this.cacheManager.del('users:all')

        this.eventEmitter.emit('user_registered', user?.name)

        const payload: JwtPayload = {
            id: user?.id,
            role: user?.role
        }

        const access_token = await this.jwtService.signAsync(payload)

        return {
            message: "Registered successfully",
            access_token: access_token,
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
                imageUrl: user?.imageUrl
            }
        }
    }

    async login(data: LoginDto) {
        const { email, password } = data

        const user =
            await this.prisma.user.findUnique({
                where: { email }
            })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const payload: JwtPayload = {
            id: user?.id,
            role: user?.role
        }

        const access_token = await this.jwtService.signAsync(payload)

        return {
            message: "Logged in successfully",
            access_token: access_token,
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                role: user?.role
            }
        }
    }

    async getUser(id: string) {
        const user =
            await this.prisma.user.findUnique({
                where: { id }, select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return user
    }
}
