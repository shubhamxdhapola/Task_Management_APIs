import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register-dto/register-dto.js';
import { LoginDto } from './dto/login-dto/login-dto.js';
import { AuthenticateGuard, type AuthenticatedRequest } from './guards/authenticate/authenticate.guard.js';
import type { Response } from 'express'
import { cookie_options } from '../libs/cookie.options.js';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register the user' })
    @Post('register')
    async register(
        @Body() data: RegisterDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const result = await this.authService.register(data)
        response.cookie('access_token', result?.access_token, cookie_options)
        return {
            data: result?.user,
            message: result?.message
        }
    }
    @ApiOperation({ summary: 'Login the user' })
    @Post('login')
    @HttpCode(200)
    async login(
        @Body() data: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const result = await this.authService.login(data)
        response.cookie('access_token', result?.access_token, cookie_options)
        return {
            data: result?.user,
            message: result?.message
        }
    }

    @ApiOperation({ summary: 'Logout the user' })
    @ApiCookieAuth('access_token')
    @UseGuards(AuthenticateGuard)
    @Post('logout')
    @HttpCode(200)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token', { ...cookie_options, maxAge: 0 });
        return { message: "Logged out succesfully" }
    }

    @ApiOperation({ summary: 'Get the current user' })
    @ApiCookieAuth('access_token')
    @UseGuards(AuthenticateGuard)
    @Get('user-info')
    async getUserInfo(@Req() req: AuthenticatedRequest) {
        return this.authService.getUser(req?.user?.id)
    }

}
