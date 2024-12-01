import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CreateUserSchema } from '../validations';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { ValidationPipe } from 'src/pipes';
import { Public } from 'src/shared/decorators';
import { UsersService } from '../services';
import { User } from 'src/shared/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) { }

  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.service.findAll();
  // }

  // @Get(':id')
  // findById(@Param('id') id: number): Promise<User> {
  //   return this.service.get(id);
  // }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.service.getByEmail(email);
  }

  @Post()
  @Public()
  createUser(
    @Body(new ValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.service.create(createUserDto);
  }

  @Put(':id')
  @Public()
  UpdateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe(CreateUserSchema)) updateDto: UpdateUserDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Post(':id')
  @Public()
  DeleteUser(
    @Param('id') id: number,
    @Body() updateDto: any,
  ) {
    return this.service.statusUpdate(id, updateDto);
  }

  @Get()
  findByRoles(@Param('id') id: number): Promise<User[]> {
    return this.service.getInnerJoinList();
  }

  @Get(':id')
  findByUser(@Param('id') id: number): Promise<User> {
    return this.service.getInnerJoin(id);
  }
  
}
