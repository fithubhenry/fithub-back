// schedule.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TurnosReminderService } from '../turno/turnoRecordatorio.service';
import { TurnosService } from 'src/turno/turno.service'; // 👈 servicio que maneja los turnos

@Injectable()
export class ScheduleService {
  constructor(
    private readonly reminderService: TurnosReminderService,
    private readonly turnosService: TurnosService,
  ) {}

  // Se ejecuta cada hora
  @Cron(CronExpression.EVERY_HOUR)
  async handleReminderJob() {
    // 1. Buscar turnos que tengan un recordatorio pendiente
    const turnos = await this.turnosService.findTurnosProximos(); // 👈 este método lo implementás vos

    // 2. Programar recordatorios para cada turno
    for (const turno of turnos) {
      await this.reminderService.scheduleReminder(turno);
    }
  }
}
