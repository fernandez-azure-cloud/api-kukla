import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes';
import { Public } from 'src/shared/decorators';
import { Role, User } from 'src/shared/entities';
import { RoleService } from '../services/role.service';
import { CreateRoleSchema } from '../validations/role.schema';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Role> {
    return this.service.get(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<Role> {
    return this.service.getByEmail(email);
  }

  @Post()
  @Public()
  createUser(
    @Body(new ValidationPipe(CreateRoleSchema)) createUserDto: CreateRoleDto,
  ) {
    return this.service.create(createUserDto);
  }
}
