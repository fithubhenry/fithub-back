// schedule.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TurnosReminderService } from '../turno/turnoRecordatorio.service';
import { TurnosService } from 'src/turno/turno.service'; // 👈 servicio que maneja los turnos
import { MailerService } from '../mail/mail.service';
import { Turno } from '../turno/entities/turno.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly reminderService: TurnosReminderService,
    private readonly turnosService: TurnosService,
    private readonly mailerService: MailerService,
  ) {}

  // -------------------------
  // Helpers para fechas/horas
  // -------------------------
  private parseTimeString(
    time?: string,
  ): { h: number; m: number; s: number } | null {
    if (!time) return null;
    // Formatos esperados: "HH:mm", "HH:mm:ss", "YYYY-MM-DDTHH:mm:ss..." (ISO)
    const simple = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (simple) {
      return {
        h: Number(simple[1]),
        m: Number(simple[2]),
        s: simple[3] ? Number(simple[3]) : 0,
      };
    }
    const iso = time.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (iso) {
      return { h: Number(iso[1]), m: Number(iso[2]), s: Number(iso[3]) };
    }
    return null;
  }

  private buildDateWithTime(
    dateInput: Date | string,
    time?: string,
  ): Date | null {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    const t = this.parseTimeString(time);
    if (t) {
      date.setHours(t.h, t.m, t.s, 0);
      return date;
    }
    // Si no se pudo parsear time pero la fecha es válida, devolver fecha a medianoche
    return date;
  }

  private hasTurnoEnded(turno: Turno): boolean {
    // Calcula fin de la clase a partir de fecha + horaFin (o si no hay horaFin, usa horaInicio + 1h)
    const ahora = new Date();
    const fechaClase = this.buildDateWithTime(
      turno.fecha,
      turno.horaFin ?? turno.horaInicio,
    );
    if (!fechaClase) {
      // si no podemos construir fecha, no asumimos que terminó -> devolvemos false
      return false;
    }

    // Si sólo tenemos horaInicio y no horaFin -> sumar 1 hora como fallback
    if (!turno.horaFin && turno.horaInicio) {
      const fallbackFin = this.buildDateWithTime(turno.fecha, turno.horaInicio);
      if (!fallbackFin) return false;
      fallbackFin.setHours(fallbackFin.getHours() + 1);
      return ahora > fallbackFin;
    }

    return ahora > fechaClase;
  }

  // Se ejecuta cada hora
  @Cron(CronExpression.EVERY_HOUR)
  async handleReminderJob() {
    // 1. Buscar turnos que tengan un recordatorio pendiente
    const turnos = await this.turnosService.findTurnosProximosEntity();

    // 2. Programar recordatorios para cada turno
    for (const turno of turnos) {
      if (this.hasTurnoEnded(turno)) {
        console.log(
          `⏭️ Omitido scheduleReminder para turno ${turno.id}: clase ya finalizada`,
        );
        continue;
      }
      await this.reminderService.scheduleReminder(turno);
    }
  }

  // ✅ Cron job que se ejecuta cada 5 minutos para recordar TODOS los turnos activos
  @Cron('*/5 * * * *') // Cada 5 minutos
  async handleTurnosReminder() {
    console.log('🔔 Ejecutando recordatorio de turnos cada 5 minutos...');

    try {
      // Buscar TODOS los turnos activos (pendientes y confirmados)
      const turnosActivos = await this.turnosService.findTurnosActivosEntity();

      console.log(
        `📋 Encontrados ${turnosActivos.length} turnos activos para recordar`,
      );

      for (const turno of turnosActivos) {
        if (this.hasTurnoEnded(turno)) {
          console.log(
            `⏭️ Omitido envío para turno ${turno.id}: clase ya finalizada`,
          );
          continue;
        }
        await this.sendTurnoReminderEmail(turno);
      }

      if (turnosActivos.length > 0) {
        console.log(
          `✅ Enviados ${turnosActivos.length} recordatorios de turnos`,
        );
      }
    } catch (error) {
      console.error('❌ Error enviando recordatorios de turnos:', error);
    }
  }

  // ✅ Cron job que se ejecuta cada minuto para verificar clases que comienzan en 5 minutos
  @Cron(CronExpression.EVERY_MINUTE)
  async handleFiveMinuteWarning() {
    console.log('🔍 Verificando clases que comienzan en 5 minutos...');

    try {
      const ahora = new Date();
      const enCincoMinutos = new Date(ahora.getTime() + 5 * 60 * 1000); // 5 minutos en el futuro

      // Buscar turnos que comienzan exactamente en 5 minutos (con margen de 1 minuto)
      const turnosProximos = await this.turnosService.findTurnosEnRangoEntity(
        new Date(enCincoMinutos.getTime() - 30 * 1000), // 30 segundos antes
        new Date(enCincoMinutos.getTime() + 30 * 1000), // 30 segundos después
      );

      for (const turno of turnosProximos) {
        if (this.hasTurnoEnded(turno)) {
          console.log(
            `⏭️ Omitido envío para turno ${turno.id}: clase ya finalizada`,
          );
          continue;
        }
        await this.sendFiveMinuteWarningEmail(turno);
      }

      if (turnosProximos.length > 0) {
        console.log(
          `✅ Enviadas ${turnosProximos.length} notificaciones de 5 minutos`,
        );
      }
    } catch (error) {
      console.error('❌ Error verificando clases próximas:', error);
    }
  }

  // ✅ Método para enviar email de prueba cuando se crea un turno
  async sendTestEmailOnBooking(
    userEmail: string,
    userName: string,
    claseNombre: string,
  ) {
    console.log('🚀 Enviando email de prueba por nueva reserva de turno...');

    try {
      const frasesPrueba = [
        '¡Hola! Este es un email de prueba desde FitHub 🏋️‍♂️',
        '✨ Sistema de notificaciones funcionando correctamente',
        '🔔 Confirmación de reserva automática desde el backend',
        '💪 ¡Tu plataforma fitness está en funcionamiento!',
        '🚀 Email automático enviado al reservar turno',
      ];

      // Seleccionar frase aleatoria
      const fraseAleatoria =
        frasesPrueba[Math.floor(Math.random() * frasesPrueba.length)];

      await this.mailerService.sendMail({
        to: userEmail,
        subject: `🧪 Test FitHub - Turno Reservado - ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f0f8ff; border-radius: 8px;">
            <h2 style="color: #333;">🧪 Email de Prueba - FitHub</h2>
            <p style="color: #555; font-size: 16px;">¡Hola ${userName}!</p>
            <p style="color: #555; font-size: 16px;">${fraseAleatoria}</p>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ Turno Reservado</h3>
              <p style="color: #2d5a2d; margin: 0; font-size: 14px;">
                <strong>Clase:</strong> ${claseNombre}<br>
                <strong>Usuario:</strong> ${userName}<br>
                <strong>Email:</strong> ${userEmail}
              </p>
            </div>

            <p style="color: #777; font-size: 14px;">
              <strong>Hora:</strong> ${new Date().toLocaleString()}<br>
              <strong>Estado:</strong> ✅ Sistema funcionando correctamente
            </p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                📧 Este email se envía automáticamente cuando reservas un turno para probar el sistema de notificaciones.
              </p>
            </div>
          </div>
        `,
      });

      console.log('✅ Email de prueba enviado exitosamente a:', userEmail);
    } catch (error) {
      console.error('❌ Error enviando email de prueba:', error);
    }
  }

  // ✅ Método para enviar email de advertencia 5 minutos antes de la clase
  private async sendFiveMinuteWarningEmail(turno: Turno) {
    if (turno.estado === 'CANCELADO' || turno.estado === 'FINALIZADO') {
      console.log(
        `⏭️ No se envía advertencia: turno ${turno.id} está ${turno.estado}`,
      );
      return;
    }
    console.log('🚨 Enviando advertencia 5 minutos antes de la clase...');

    if (!turno.user || !turno.user.email) {
      console.warn(
        `⚠️ No se puede enviar advertencia: turno.user o email es null para turno ${turno.id}`,
      );
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: turno.user.email,
        subject: `🚨 ¡Tu clase comienza en 5 minutos! - ${turno.clase.nombre}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 5px solid #ffc107;">
          <h2 style="color: #856404;">🚨 ¡Atención ${turno.user.nombre}!</h2>
          <p style="color: #856404; font-size: 18px; font-weight: bold;">
            Tu clase comienza en 5 minutos
          </p>
          <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin: 0 0 15px 0;">📋 Detalles de tu clase</h3>
            <p style="color: #333; margin: 5px 0; font-size: 16px;">
              <strong>🏋️‍♂️ Clase:</strong> ${turno.clase.nombre}<br>
              <strong>⏰ Hora:</strong> ${turno.horaInicio}<br>
              <strong>📅 Fecha:</strong> ${new Date(turno.fecha).toLocaleDateString()}<br>
              <strong>👤 Instructor:</strong> ${turno.clase.instructor || 'Por confirmar'}
            </p>
          </div>
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-size: 14px;">
              💡 <strong>Recordatorio:</strong> Llega unos minutos antes para prepararte adecuadamente.
            </p>
          </div>
          <p style="color: #777; font-size: 14px;">
            <strong>Hora del aviso:</strong> ${new Date().toLocaleString()}<br>
            <strong>Estado:</strong> ✅ Sistema de notificaciones funcionando
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #856404; font-size: 16px; font-weight: bold;">
              ¡Nos vemos en la clase! 💪
            </p>
          </div>
        </div>
      `,
      });

      console.log('✅ Advertencia de 5 minutos enviada a:', turno.user.email);
    } catch (error) {
      console.error('❌ Error enviando advertencia de 5 minutos:', error);
    }
  }

  // ✅ Método para enviar recordatorio periódico de turnos cada 5 minutos
  private async sendTurnoReminderEmail(turno: Turno) {
    if (turno.estado === 'CANCELADO' || turno.estado === 'FINALIZADO') {
      console.log(
        `⏭️ No se envía recordatorio: turno ${turno.id} está ${turno.estado}`,
      );
      return;
    }
    console.log('🔔 Enviando recordatorio periódico de turno...');

    if (!turno.user || !turno.user.email) {
      console.warn(
        `⚠️ No se puede enviar recordatorio: turno.user o email es null para turno ${turno.id}`,
      );
      return;
    }
    try {
      // Calcular cuánto tiempo falta para la clase
      const fechaClase = new Date(turno.fecha);
      const ahora = new Date();
      const diferenciaTiempo = fechaClase.getTime() - ahora.getTime();
      const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

      let tiempoRestante = '';
      if (diferenciaTiempo < 0) {
        tiempoRestante = '⚠️ Esta clase ya pasó';
      } else if (diferenciaTiempo < 60 * 60 * 1000) {
        // Menos de 1 hora
        const minutosRestantes = Math.ceil(diferenciaTiempo / (1000 * 60));
        tiempoRestante = `⏰ Faltan ${minutosRestantes} minutos`;
      } else if (diferenciaTiempo < 24 * 60 * 60 * 1000) {
        // Menos de 1 día
        const horasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60));
        tiempoRestante = `🕐 Faltan ${horasRestantes} horas`;
      } else {
        tiempoRestante = `📅 Faltan ${diasRestantes} días`;
      }

      await this.mailerService.sendMail({
        to: turno.user.email,
        subject: `🔔 Recordatorio: Tienes una clase de ${turno.clase.nombre} programada`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 5px solid #2196f3;">
            <h2 style="color: #1976d2;">🔔 ¡Hola ${turno.user.nombre}!</h2>
            <p style="color: #1976d2; font-size: 18px; font-weight: bold;">
              Recordatorio: Tienes una clase programada
            </p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #388e3c; margin: 0 0 15px 0;">📋 Detalles de tu turno</h3>
              <p style="color: #333; margin: 5px 0; font-size: 16px;">
                <strong>🏋️‍♂️ Clase:</strong> ${turno.clase.nombre}<br>
                <strong>⏰ Hora:</strong> ${turno.horaInicio}<br>
                <strong>📅 Fecha:</strong> ${new Date(turno.fecha).toLocaleDateString()}<br>
                <strong>📍 Estado:</strong> ${turno.estado}<br>
                <strong>⏳ Tiempo restante:</strong> ${tiempoRestante}
              </p>
            </div>

            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #2d5a2d; margin: 0; font-size: 14px;">
                🔄 <strong>Recordatorio automático:</strong> Te enviamos este recordatorio cada 5 minutos para que no olvides tus clases programadas.
              </p>
            </div>

            <p style="color: #777; font-size: 14px;">
              <strong>Enviado:</strong> ${new Date().toLocaleString()}<br>
              <strong>ID del Turno:</strong> ${turno.id}
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #1976d2; font-size: 16px; font-weight: bold;">
                ¡No olvides tu clase! 💪
              </p>
            </div>
          </div>
        `,
      });

      console.log(
        '✅ Recordatorio enviado a:',
        turno.user.email,
        '- Clase:',
        turno.clase.nombre,
      );
    } catch (error) {
      console.error('❌ Error enviando recordatorio de turno:', error);
    }
  }
}
