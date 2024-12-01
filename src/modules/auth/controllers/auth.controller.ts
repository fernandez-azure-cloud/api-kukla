import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes';
import { RefreshDto, SignInDto, SignInResponse } from '../dtos';
import { RefreshSchema, SignInSchema } from '../validations';
import { AuthService } from '../services';
import { Public } from 'src/shared/decorators';
import { RequestDto } from 'src/shared/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  signIn(
    @Body(new ValidationPipe(SignInSchema)) signInDto: SignInDto,
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('refresh')
  @Public()
  refresh(
    @Body(new ValidationPipe(RefreshSchema)) refreshDto: RefreshDto,
  ): Promise<SignInResponse> {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  logOut(@Req() request: Request): Promise<any> {
    const token = this.authService.getTokenFromRequest(request);
    return this.authService.logOut(token);
  }

  @Get('permissions')
  getPermissions(@Req() request: RequestDto): Promise<any> {
    return this.authService.getPermissions(request.user.id);
  }
}
