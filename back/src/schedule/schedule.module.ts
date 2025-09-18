import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TurnosService } from 'src/turno/turno.service';
import { TurnosReminderService } from 'src/turno/turnoRecordatorio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from 'src/turno/entities/turno.entity';
import { User } from 'src/user/entities/user.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Turno, User, Clase]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, TurnosService, TurnosReminderService],
})
export class ScheduleModule {}
