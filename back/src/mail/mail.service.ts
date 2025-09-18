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

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"FITHUB 👋" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Bienvenido a FITHUB 🚀',
        text: 'Tu plataforma fitness para alcanzar tus metas.',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="text-align: center;">
            <img src="https://i.ibb.co/7n7tXG6/logo.png" alt="Mi App Logo" style="width: 150px; margin-bottom: 20px;" />
          </div>
          <h2 style="color: #333;">¡Hola ${name}!</h2>
          <p style="color: #555;">Gracias por registrarte en nuestra plataforma. Aquí te contamos qué puedes hacer:</p>
          <ul style="color: #555;">
            <li><strong>Explorar:</strong> Descubre todas las funcionalidades de nuestra app.</li>
            <li><strong>Crear contenido:</strong> Comienza a interactuar y aprovechar todo lo que ofrecemos.</li>
            <li><strong>Recibir beneficios:</strong> Aprovecha promociones y actualizaciones exclusivas.</li>
          </ul>
          <p style="color: #555;">¡Estamos felices de tenerte con nosotros!</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="background-color: #ff3b3f; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Ir a la App</a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Si no te registraste, ignora este correo.</p>
        </div>
      `,
      });
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
    try {
      await this.transporter.sendMail({
        from: `"FITHUB 👋" <${process.env.SMTP_USER}>`,
        ...options,
      });
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new InternalServerErrorException('No se pudo enviar el email');
    }
  }
}
