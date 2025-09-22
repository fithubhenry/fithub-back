// schedule.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TurnosReminderService } from '../turno/turnoRecordatorio.service';
import { TurnosService } from 'src/turno/turno.service'; // 👈 servicio que maneja los turnos
import { MailerService } from '../mail/mail.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly reminderService: TurnosReminderService,
    private readonly turnosService: TurnosService,
    private readonly mailerService: MailerService,
  ) {}

  // ✅ Cron job de prueba - envía email cada 2 minutos
  @Cron('*/2 * * * *') // Cada 2 minutos
  async handleTestEmailJob() {
    console.log('🚀 Ejecutando cron job de prueba - enviando email...');

    try {
      const frasesPrueba = [
        '¡Hola! Este es un email de prueba desde FitHub 🏋️‍♂️',
        '✨ Sistema de notificaciones funcionando correctamente',
        '🔔 Recordatorio automático desde el backend',
        '💪 ¡Tu plataforma fitness está en funcionamiento!',
        '🚀 Cron job ejecutándose cada 2 minutos como debe ser',
      ];

      // Seleccionar frase aleatoria
      const fraseAleatoria =
        frasesPrueba[Math.floor(Math.random() * frasesPrueba.length)];

      await this.mailerService.sendMail({
        to: process.env.SMTP_USER || 'test@example.com', // Envía al mismo email configurado
        subject: `🧪 Test FitHub - ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f0f8ff; border-radius: 8px;">
            <h2 style="color: #333;">🧪 Email de Prueba - FitHub</h2>
            <p style="color: #555; font-size: 16px;">${fraseAleatoria}</p>
            <p style="color: #777; font-size: 14px;">
              <strong>Hora:</strong> ${new Date().toLocaleString()}<br>
              <strong>Estado:</strong> ✅ Sistema funcionando correctamente
            </p>
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="color: #2d5a2d; margin: 0; font-size: 14px;">
                📧 Este email se envía automáticamente cada 2 minutos para probar el sistema de notificaciones.
              </p>
            </div>
          </div>
        `,
      });

      console.log('✅ Email de prueba enviado exitosamente');
    } catch (error) {
      console.error('❌ Error enviando email de prueba:', error);
    }
  }

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
