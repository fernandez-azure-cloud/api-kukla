import { SharedModuleOptions } from 'src/shared';

export default () => {
  const sharedConfig: SharedModuleOptions = {
    hashOptions: { salt: +process.env.HASH_SALT },
    jwtOptions: { refreshTokenExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN },
    smtpOptions: {
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
  };
  return sharedConfig;
};
