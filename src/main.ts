import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*', // Permite solicitudes solo desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
    credentials: true, // Habilita el intercambio de cookies a través de CORS
  });
  
  await app.listen(3000);
}
bootstrap();
