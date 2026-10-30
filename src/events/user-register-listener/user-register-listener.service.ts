import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserRegisterListenerService {
    @OnEvent('user_registered')
    handleUserRegistered(name: string) {
        console.log(`Welcome, ${name}!`);
    }
}
