import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptService, UsersService } from 'src/shared/services';
import { SignInResponse } from '../dtos';
import { PermissionsRepository, TokenRepository } from '../repositories';
import { Token, User } from 'src/shared/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptService: CryptService,
    private readonly tokenRepository: TokenRepository,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async signIn(email: string, password: string): Promise<SignInResponse> {
    const user = await this.usersService.getOneByEmail(email);

    if (!user || !this.cryptService.comparePassword(password, user.password)) {
      // throw new UnauthorizedException();
      throw new UnauthorizedException(
        'El Usuario o la contraseña es incorrecta',
      );
    }

    user.password = undefined;
    const response = this.generateTokens(user);
    return response;
  }

  async refresh(refreshToken: string): Promise<SignInResponse> {
    try {
      await this.cryptService.verifyAsync(refreshToken);
      const token =
        await this.tokenRepository.getTokenByRefreshToken(refreshToken);

      if (!token) {
        throw new UnauthorizedException();
      }

      const response = this.generateTokens(token.user);
      return response;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validateAccessToken(accessToken: string): Promise<boolean> {
    const token = await this.tokenRepository.getTokenByAccessToken(accessToken);

    if (!token) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async logOut(accessToken: string): Promise<boolean> {
    const token = await this.tokenRepository.getTokenByAccessToken(accessToken);
    await this.tokenRepository.deleteTokenByAccessToken(token);
    return true;
  }

  private async generateTokens(user: User): Promise<SignInResponse> {
    const payload = { user: user };
    const response = new SignInResponse();
    response.accessToken = await this.cryptService.generateAccessToken(payload);
    response.refreshToken = await this.cryptService.generateRefreshToken();
    const newToken = new Token();
    newToken.accessToken = response.accessToken;
    newToken.refreshToken = response.refreshToken;
    newToken.user = user;
    await this.tokenRepository.saveToken(newToken);
    return response;
  }

  getTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getPermissions(userId: number): Promise<any> {
    return this.usersService.getPermissions(userId);
  }

  async validateAuthorization(
    user: User,
    path: string,
    method: string,
    action?: string,
  ): Promise<boolean> {
    if (method !== 'GET' && !action) return false;

    return this.permissionsRepository.hasPermission(
      user.role.id,
      path.replace('/api/', ''),
      method,
      action,
    );
  }
}
