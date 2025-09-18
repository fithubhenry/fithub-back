import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TurnosService } from 'src/turno/turno.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, TurnosService],
})
export class ScheduleModule {}
