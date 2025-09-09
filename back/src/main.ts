import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ENV from './config/enviroments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  //Configuracion de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestion de Gimnasio API')
    .setDescription(
      'API para gestionar usuarios, clases y reservas del gimnasio',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 👈 Esto mantiene el token entre sesiones
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades extra
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );
  //? Para trabajar en local
  // await app.listen(ENV.APP_PORT ?? 3000);
  // console.log('App corriendo en puerto: ' + ENV.APP_PORT);

  //?Puerto dinamico para RENDER
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ App corriendo en puerto: ${port}`);
}
bootstrap();
