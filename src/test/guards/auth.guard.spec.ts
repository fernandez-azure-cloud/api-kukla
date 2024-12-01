import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AuthGuard } from 'src/guards';
import { CryptService } from 'src/shared/services';

const reflectorMock = {
  getAllAndOverride: jest.fn().mockReturnValue(true),
};

const cryptServiceMock = {
  verifyAsync: jest
    .fn()
    .mockReturnValue(Promise.resolve({ userId: 1, username: 'prueba1' })),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let cryptService: CryptService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: Reflector, useValue: reflectorMock },
        { provide: CryptService, useValue: cryptServiceMock },
        AuthGuard,
      ],
    }).compile();
    guard = moduleRef.get<AuthGuard>(AuthGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
    cryptService = moduleRef.get<CryptService>(CryptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for public', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return true when token is valid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer token' },
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should return false when no have token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
    expect(async () => {
      await guard.canActivate(context);
    }).rejects.toThrow(UnauthorizedException);
  });

  it('should return false when token is invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(cryptService, 'verifyAsync').mockRejectedValue('invalid token');
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer token' },
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
    expect(async () => {
      await guard.canActivate(context);
    }).rejects.toThrow(UnauthorizedException);
  });
});
