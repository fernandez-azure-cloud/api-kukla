import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldSelectorService } from './selectors';
import { Role} from 'src/shared/entities';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { RoleRepository } from './repositories/role-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [FieldSelectorService, RoleService, RoleRepository],
})
export class RoleModule {}
