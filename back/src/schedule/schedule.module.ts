import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TurnosService } from 'src/turno/turno.service';
import { TurnosReminderService } from 'src/turno/turnoRecordatorio.service';
import { Turno } from 'src/turno/entities/turno.entity';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { join } from 'path';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Turno, User, Clase]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'usuario@example.com',
          pass: 'password',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter:
          new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter').HandlebarsAdapter)(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, TurnosService, TurnosReminderService],
})
export class ScheduleModule {}
