import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { User, UserRole } from 'src/shared/entities';
import { CryptService, UsersService } from 'src/shared/services';

@Injectable()
export class ManageUsersService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly usersService: UsersService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.password = this.cryptService.cryptPassword(createUserDto.password);
    user.userRoles = createUserDto.roles.map((r) => {
      const userRole = new UserRole();
      userRole.roleId = r;
      return userRole;
    });
    return this.usersService.createUser(user);
  }
}
