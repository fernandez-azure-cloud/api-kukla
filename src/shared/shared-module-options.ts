import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface SharedModuleOptions {
  hashOptions: SharedHashOptions;
  jwtOptions: SharedJwtOptions;
  smtpOptions: SMTPTransport.Options;
}

export interface SharedHashOptions {
  salt: number;
}

export interface SharedJwtOptions {
  refreshTokenExpiresIn: number;
}
