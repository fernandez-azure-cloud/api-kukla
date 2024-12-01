import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers';
import { RoleRepository, UserRepository } from './repositories';
import { UsersService } from './services';
import { FieldSelectorService } from './selectors';
import { Role, User } from 'src/shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [
    FieldSelectorService,
    UsersService,
    UserRepository,
    RoleRepository,
  ],
})
export class UserModule {}
