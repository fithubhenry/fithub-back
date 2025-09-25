import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('SENDGRID_API_KEY is not defined');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendWelcomeEmail(to: string, name: string) {
    const msg = {
      to,
      from: 'soporte@fithub.com', // Debe estar verificado en SendGrid
      subject: 'Bienvenido a FITHUB 🚀',
      text: 'Tu plataforma fitness para alcanzar tus metas.',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: linear-gradient(135deg, #f9f9f9 60%, #ff3b3f 100%); border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <div style="text-align: center;">
            <img src="https://i.ibb.co/7n7tXG6/logo.png" alt="FITHUB Logo" style="width: 120px; margin-bottom: 18px;" />
          </div>
          <h2 style="color: #ff3b3f; margin-bottom: 8px;">¡Bienvenido/a ${name}!</h2>
          <p style="color: #333; font-size: 17px;">Gracias por sumarte a FITHUB, tu plataforma fitness para alcanzar tus metas.</p>
          <ul style="color: #555; font-size: 15px; margin: 18px 0; padding-left: 20px;">
            <li>Explora clases y actividades exclusivas.</li>
            <li>Reserva turnos y gestiona tu entrenamiento.</li>
            <li>Recibe beneficios y novedades personalizadas.</li>
          </ul>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: #ff3b3f; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">Ir a la App</a>
          </div>
          <div style="text-align: center; margin-bottom: 18px;">
            <a href="https://instagram.com/fithub" style="margin: 0 8px; text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28" /></a>
            <a href="https://facebook.com/fithub" style="margin: 0 8px; text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="28" /></a>
          </div>
          <p style="color: #999; font-size: 13px; margin-top: 18px;">¿Necesitás ayuda? Escribinos a <a href="mailto:soporte@fithub.com" style="color: #ff3b3f;">soporte@fithub.com</a></p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">Si no te registraste, ignora este correo.</p>
        </div>
      `,
    };
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new InternalServerErrorException('No se pudo enviar el email');
    }
  }

  // ✅ Ahora acepta un objeto, igual que nodemailer
  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    const msg = {
      to: options.to,
      from: 'fithub.soporte@gmail.com', // Debe estar verificado en SendGrid
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    try {
      await sgMail.send(msg as any);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new InternalServerErrorException('No se pudo enviar el email');
    }
  }
}
