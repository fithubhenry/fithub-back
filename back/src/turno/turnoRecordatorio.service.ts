import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Turno } from './entities/turno.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TurnosReminderService {
  private readonly logger = new Logger(TurnosReminderService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private mailerService: MailerService,
  ) {}

  scheduleReminder(turno: Turno) {
    if (!turno.fecha || !turno.horaInicio || !turno.user) {
      this.logger.warn(
        `No se puede programar recordatorio para turno incompleto: ${turno.id}`,
      );
      return;
    }

    const fechaTurno = new Date(`${turno.fecha}T${turno.horaInicio}`);
    const reminderTime = new Date(fechaTurno.getTime() - 60 * 60 * 1000); // 1h antes

    if (reminderTime < new Date()) {
      this.logger.log(
        `El turno ${turno.id} ya está en el pasado, no se programa recordatorio`,
      );
      return;
    }

    const job = new CronJob(reminderTime, async () => {
      this.logger.log(`Enviando recordatorio para turno ${turno.id}`);

      await this.mailerService.sendMail({
        to: turno.user.email,
        subject: 'Recordatorio de turno',
        text: 'Recordatorio de turno',
        html: `
          <h1>¡Recordá tu turno!</h1>
          <p>Clase: ${turno.clase[0]}</p> //! PARA FIXEAR ESTA PARTE (DEBE RECIBIR LA CLASE)
          <p>Fecha: ${turno.fecha}</p>
          <p>Hora: ${turno.horaInicio} - ${turno.horaFin}</p>
        `,
      });
    });

    this.schedulerRegistry.addCronJob(`turno-${turno.id}`, job);
    job.start();

    this.logger.log(
      `Recordatorio programado para turno ${turno.id} a las ${reminderTime}`,
    );
  }

  cancelReminder(turnoId: string) {
    try {
      this.schedulerRegistry.deleteCronJob(`turno-${turnoId}`);
      this.logger.log(`Recordatorio cancelado para turno ${turnoId}`);
    } catch {
      this.logger.warn(`No había recordatorio para turno ${turnoId}`);
    }
  }
}
