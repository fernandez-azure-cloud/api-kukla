import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CryptService } from 'src/shared/services';
import { HASH_OPTIONS } from 'src/shared/tokens';

const hashOptionsMock = {
  salt: 9,
};

const secretMock = 'secret-key';

describe('CryptService', () => {
  let cryptService: CryptService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: secretMock })],
      providers: [
        CryptService,
        { provide: HASH_OPTIONS, useValue: hashOptionsMock },
      ],
    }).compile();
    cryptService = moduleRef.get<CryptService>(CryptService);
  });

  it('should encrypt password', () => {
    const password = '123456';
    const result = cryptService.cryptPassword(password);
    expect(result).not.toEqual(password);
  });

  it('should return true when compare same password', () => {
    const password = '12345';
    const encrypted = cryptService.cryptPassword(password);
    const isSame = cryptService.comparePassword(password, encrypted);
    expect(isSame).toBe(true);
  });

  it('should return false when compare diferent password', () => {
    const password = '12345';
    const encrypted = cryptService.cryptPassword(password);
    const isSame = cryptService.comparePassword('12346', encrypted);
    expect(isSame).toBe(false);
  });

  it('should  generate a valid JWT token', async () => {
    const payload = { userId: 5, username: 'Prueba1' };
    const token = await cryptService.signAsync(payload);
    const decodedToken = await cryptService.verifyAsync(token);
    expect(decodedToken.userId).toEqual(payload.userId);
    expect(decodedToken.username).toEqual(payload.username);
  });
});
