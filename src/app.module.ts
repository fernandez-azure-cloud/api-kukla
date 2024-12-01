import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors';
import { CustomExceptionFilter, ValidationFilter } from './filters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth';
import { SharedModule } from './shared';
import dbConfig from './config/database.config';
import sharedConfig from './config/shared.config';
import { UserModule } from './modules/users';
import { RoleModule } from './modules/role/role.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, sharedConfig],
    }),
    TypeOrmModule.forRoot(dbConfig()),
    UserModule,
    RoleModule,
    AuthModule,
    SharedModule.forRoot(sharedConfig()),
    ProjectsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
