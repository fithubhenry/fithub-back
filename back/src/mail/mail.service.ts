import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // ej: smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true solo si usas 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string) {
    try {
      await this.transporter.sendMail({
        from: `"Mi App 👋" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Bienvenido a la aplicación 🚀',
        text: 'Gracias por registrarte en nuestra plataforma.',
        html: `<h1>¡Bienvenido!</h1><p>Ya podés empezar a usar la app 🚀</p>`,
      });
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new InternalServerErrorException('No se pudo enviar el email');
    }
  }
}
