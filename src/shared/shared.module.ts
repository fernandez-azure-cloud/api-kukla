import { DynamicModule, Module } from '@nestjs/common';
import { CryptService, NotificationService, UsersService } from './services';
import {
  EmailRepository,
  NotificationRepository,
  UsersRepository,
} from './repositories';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailTemplateVersion,
  SendProjectNotification,
  User,
} from './entities';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { SharedModuleOptions } from './shared-module-options';
import { HASH_OPTIONS, JWT_OPTIONS, SMTP_OPTIONS } from './tokens';

@Module({})
export class SharedModule {
  static forRoot(options: SharedModuleOptions): DynamicModule {
    return {
      module: SharedModule,
      global: true,
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
        }),
        JwtModule.register(jwtConfig()),
        TypeOrmModule.forFeature([
          User,
          EmailTemplateVersion,
          SendProjectNotification,
        ]),
      ],
      providers: [
        UsersService,
        CryptService,
        NotificationService,
        UsersRepository,
        EmailRepository,
        NotificationRepository,
        { provide: SMTP_OPTIONS, useValue: options.smtpOptions },
        { provide: JWT_OPTIONS, useValue: options.jwtOptions },
        { provide: HASH_OPTIONS, useValue: options.hashOptions },
      ],
      exports: [UsersService, CryptService, NotificationService],
    };
  }
}
