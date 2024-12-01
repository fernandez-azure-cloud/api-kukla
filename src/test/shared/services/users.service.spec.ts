import { Test } from '@nestjs/testing';
import { User } from 'src/shared/entities';
import { UsersRepository } from 'src/shared/repositories';
import { UsersService } from 'src/shared/services';

const usersRepositoryMock = {
  findAll: jest.fn(),
  createUser: jest.fn(),
  getOneByEmail: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users', async () => {
    const usersMock = [new User(), new User()];
    jest
      .spyOn(usersRepository, 'findAll')
      .mockReturnValue(Promise.resolve(usersMock));
    const result = await usersService.findAll();
    expect(result).toEqual(usersMock);
  });

  it('should return created user', async () => {
    const userMock = new User();
    jest
      .spyOn(usersRepository, 'createUser')
      .mockReturnValue(Promise.resolve(userMock));
    const result = await usersService.createUser(new User());
    expect(result).toEqual(userMock);
  });

  it('should return user', async () => {
    const userMock = new User();
    jest
      .spyOn(usersRepository, 'getOneByEmail')
      .mockReturnValue(Promise.resolve(userMock));
    const result = await usersService.getOneByEmail('prueba1@example.com');
    expect(result).toEqual(userMock);
  });
});
