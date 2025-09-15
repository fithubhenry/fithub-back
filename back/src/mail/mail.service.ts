import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // O tu proveedor
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"Mi Web" <${process.env.MAIL_USER}>`,
      to,
      subject: '¡Bienvenido a nuestra web!',
      html: `
        <h1>Hola ${name} 👋</h1>
        <p>Gracias por registrarte en nuestra aplicación 🚀</p>
      `,
    });
  }
}
