import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRegisterListenerService } from './events/user-register-listener/user-register-listener.service.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminModule,
    TasksModule,
    CloudinaryModule
  ],
  providers: [UserRegisterListenerService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
