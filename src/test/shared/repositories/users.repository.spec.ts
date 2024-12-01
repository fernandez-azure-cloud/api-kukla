import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';
import { UsersRepository } from 'src/shared/repositories';
import { Repository } from 'typeorm';

const userRepositoryMock = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
      ],
    }).compile();
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users', async () => {
    const usersMock = [new User()];
    jest
      .spyOn(userRepository, 'find')
      .mockReturnValue(Promise.resolve(usersMock));
    const result = await usersRepository.findAll();
    expect(result).toEqual(usersMock);
  });

  it('should return created user', async () => {
    const userMock = new User();
    jest.spyOn(userRepository, 'create').mockReturnValue(userMock);
    jest
      .spyOn(userRepository, 'save')
      .mockReturnValue(Promise.resolve(userMock));
    const result = await usersRepository.createUser(new User());
    expect(result).toEqual(userMock);
  });

  it('should return user', async () => {
    const userMock = new User();
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock));
    const result = await usersRepository.getOneByEmail('prueba1@example.com');
    expect(result).toEqual(userMock);
  });
});
