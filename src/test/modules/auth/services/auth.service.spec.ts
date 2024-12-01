import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/services';
import { User } from 'src/shared/entities';
import { CryptService, UsersService } from 'src/shared/services';

const usersServiceMock = {
  getOneByEmail: jest.fn(),
};

const cryptServiceMock = {
  comparePassword: jest.fn(),
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let cryptService: CryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: CryptService, useValue: cryptServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    cryptService = module.get<CryptService>(CryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return access token', async () => {
    const user = new User();
    user.email = 'prueba1@example.com';
    user.id = 2;
    user.password = '123456';
    user.name = 'prueba1';
    user.roles = [];
    jest
      .spyOn(usersService, 'getOneByEmail')
      .mockReturnValue(Promise.resolve(user));
    jest.spyOn(cryptService, 'comparePassword').mockReturnValue(true);
    jest
      .spyOn(cryptService, 'signAsync')
      .mockReturnValue(Promise.resolve('token'));
    const result = await authService.signIn('prueba1', '123456');
    expect(result.accessToken).toEqual('token');
  });

  it('should throw unauthorized error when user not exists', async () => {
    jest
      .spyOn(usersService, 'getOneByEmail')
      .mockReturnValue(Promise.resolve(undefined));
    expect(async () => {
      await authService.signIn('prueba1', '123456');
    }).rejects.toThrow(UnauthorizedException);
  });

  it('should throw unauthorized error when password is diferent', async () => {
    const user = new User();
    user.email = 'prueba1@example.com';
    user.id = 2;
    user.password = 'qwerty';
    user.name = 'prueba1';
    user.roles = [];
    jest
      .spyOn(usersService, 'getOneByEmail')
      .mockReturnValue(Promise.resolve(user));
    jest.spyOn(cryptService, 'comparePassword').mockReturnValue(false);
    expect(async () => {
      await authService.signIn('prueba1', '123456');
    }).rejects.toThrow(UnauthorizedException);
  });
});
