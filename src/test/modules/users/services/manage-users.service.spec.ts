import { Test } from '@nestjs/testing';
import { CreateUserDto } from 'src/modules/users/dtos';
import { ManageUsersService } from 'src/modules/users/services';
import { User } from 'src/shared/entities';
import { CryptService, UsersService } from 'src/shared/services';

const cryptServiceMock = {
  cryptPassword: jest.fn(),
};
const usersServiceMock = {
  findAll: jest.fn(),
  createUser: jest.fn(),
};

describe('ManageUsersService', () => {
  let manageUsersService: ManageUsersService;
  let usersService: UsersService;
  let cryptService: CryptService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ManageUsersService,
        { provide: CryptService, useValue: cryptServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();
    manageUsersService = moduleRef.get<ManageUsersService>(ManageUsersService);
    usersService = moduleRef.get<UsersService>(UsersService);
    cryptService = moduleRef.get<CryptService>(CryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users', async () => {
    const usersMock = [new User(), new User(), new User()];
    jest
      .spyOn(usersService, 'findAll')
      .mockReturnValue(Promise.resolve(usersMock));
    const result = await manageUsersService.findAll();
    expect(result).toEqual(usersMock);
  });

  it('should encrypt password', async () => {
    jest.spyOn(cryptService, 'cryptPassword');
    const createUser = {
      email: 'prueba1@example.com',
      name: 'Prueba1',
      password: '123456',
      roles: [1],
    } as CreateUserDto;
    await manageUsersService.createUser(createUser);
    expect(cryptService.cryptPassword).toHaveBeenCalledWith(
      createUser.password,
    );
  });

  it('should return created user', async () => {
    const createUser = {
      email: 'prueba1@example.com',
      name: 'Prueba1',
      password: '123456',
      roles: [1],
    } as CreateUserDto;
    const userMock = new User();
    userMock.id = 9;
    userMock.email = createUser.email;
    userMock.name = createUser.name;
    userMock.password = 'asdsfwefs';
    jest
      .spyOn(usersService, 'createUser')
      .mockReturnValue(Promise.resolve(userMock));
    const user = await manageUsersService.createUser(createUser);
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(userMock.id);
  });
});
