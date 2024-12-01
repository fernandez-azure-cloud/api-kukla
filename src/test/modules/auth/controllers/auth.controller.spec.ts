import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/controllers';
import { SignInDto } from 'src/modules/auth/dtos';
import { AuthService } from 'src/modules/auth/services';

const signInResponseMock = { accessToken: 'token' };
const authServiceMock = {
  signIn: jest.fn().mockReturnValue(signInResponseMock),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should return access token', async () => {
    const signInDto = new SignInDto();
    signInDto.email = 'prueba1@example.com';
    signInDto.password = '123456';
    const response = await controller.signIn(signInDto);
    expect(response.accessToken).toEqual(signInResponseMock.accessToken);
  });
});
