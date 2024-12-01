import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SharedHashOptions, SharedJwtOptions } from '../shared-module-options';
import { HASH_OPTIONS, JWT_OPTIONS } from '../tokens';

@Injectable()
export class CryptService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(HASH_OPTIONS) private readonly hashOptions: SharedHashOptions,
    @Inject(JWT_OPTIONS) private readonly jwtOptions: SharedJwtOptions,
  ) {}

  cryptPassword(password: string): string {
    return bcrypt.hashSync(password, this.hashOptions.salt);
  }

  comparePassword(userPassword: string, savedPassword: string): boolean {
    return bcrypt.compareSync(userPassword, savedPassword);
  }

  generateAccessToken(data: any): Promise<string> {
    return this.jwtService.signAsync(data);
  }

  generateRefreshToken(): Promise<string> {
    return this.jwtService.signAsync(
      {},
      { expiresIn: this.jwtOptions.refreshTokenExpiresIn },
    );
  }

  verifyAsync(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
