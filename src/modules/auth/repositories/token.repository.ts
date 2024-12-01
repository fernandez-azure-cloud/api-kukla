import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  saveToken(token: Token): Promise<Token> {
    return this.tokenRepository.save(token);
  }

  getTokenByRefreshToken(refreshToken: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        refreshToken,
      },
      select: {
        accessToken: true,
        refreshToken: true,
        user: {
          id: true,
          name: true,
          password: true,
          userRoles: {
            roleId: true,
            role: {
              id: true,
              code: true,
            },
          },
        },
      },
      relations: {
        user: {
          userRoles: {
            role: true,
          },
        },
      },
    });
  }

  getTokenByAccessToken(accessToken: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        accessToken,
      },
    });
  }

  async deleteTokenByAccessToken(token: Token): Promise<Token> {
    const result = await this.tokenRepository.softRemove(token);
    return result;
  }
}
