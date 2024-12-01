import { JwtModuleOptions } from '@nestjs/jwt';

export default () => {
  const jwtConfig: JwtModuleOptions = {
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: +process.env.JWT_EXPIRES_IN },
  };
  return jwtConfig;
};
