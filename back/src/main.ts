import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades extra
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log('App corriendo en puerto: ' + process.env.APP_PORT);
}
bootstrap();
