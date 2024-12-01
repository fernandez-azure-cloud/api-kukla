import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.DATABASE_SYNC === 'true',
  };
  return dbConfig;
};
