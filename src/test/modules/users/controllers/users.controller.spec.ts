import { Test } from '@nestjs/testing';
import { UsersController } from 'src/modules/users/controllers';
import { CreateUserDto } from 'src/modules/users/dtos';
import { ManageUsersService } from 'src/modules/users/services';
import { User } from 'src/shared/entities';

const manageUsersServiceMock = {
  findAll: jest.fn(),
  createUser: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let manageUsersService: ManageUsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: ManageUsersService, useValue: manageUsersServiceMock },
      ],
    }).compile();
    usersController = moduleRef.get<UsersController>(UsersController);
    manageUsersService = moduleRef.get<ManageUsersService>(ManageUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users', async () => {
    const usersMock = [new User(), new User(), new User()];
    jest
      .spyOn(manageUsersService, 'findAll')
      .mockReturnValue(Promise.resolve(usersMock));
    const result = await usersController.findAll();
    expect(result).toEqual(usersMock);
  });

  it('should return created user', async () => {
    const userMock = new User();
    userMock.id = 123;
    const createUser = {
      name: 'Prueba1',
      email: 'prueba1@example.com',
      password: '123345',
      roles: [1],
    } as CreateUserDto;
    jest
      .spyOn(manageUsersService, 'createUser')
      .mockReturnValue(Promise.resolve(userMock));
    const result = await usersController.createUser(createUser);
    expect(result).toBeInstanceOf(User);
    expect(result.id).toEqual(userMock.id);
  });
});
