import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services/auth.service';
import { PermissionsRepository, TokenRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/shared/entities';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthorizationGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenRepository,
    PermissionsRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AuthModule {}
