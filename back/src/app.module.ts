import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeOrmConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ClasesModule } from './clases/clases.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
<<<<<<< HEAD
<<<<<<< HEAD
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
=======
import { ScheduleModule } from './schedule/schedule.module';
>>>>>>> 1163bb12587d3d757b9c91bcf799b65d97d3e731
=======
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TurnosModule } from './turno/turno.module';
<<<<<<< HEAD
>>>>>>> 4c3f1d3770f7697e17f5fd36e210934ab653dd62
=======
import { TurnosService } from './turno/turno.service';
import { Turno } from './turno/entities/turno.entity';
>>>>>>> 7c9d6311b3141ddcdcfe26c50c44744efa772091

@Module({
  imports: [
    UserModule,
    ClasesModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),
    CloudinaryModule,
<<<<<<< HEAD
<<<<<<< HEAD
    MercadoPagoModule,
=======
    ScheduleModule,
>>>>>>> 1163bb12587d3d757b9c91bcf799b65d97d3e731
=======
    MercadoPagoModule,
    ScheduleModule,
    TurnosModule,
<<<<<<< HEAD
>>>>>>> 4c3f1d3770f7697e17f5fd36e210934ab653dd62
=======
    TypeOrmModule.forFeature([Turno]),
>>>>>>> 7c9d6311b3141ddcdcfe26c50c44744efa772091
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
