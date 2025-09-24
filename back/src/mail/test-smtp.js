const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true para puerto 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"FITHUB Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Puedes cambiar por otro destinatario
      subject: 'Prueba SMTP desde FitHub',
      text: 'Este es un correo de prueba para verificar la configuración SMTP.',
    });
    console.log('✅ Email enviado:', info.response);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

sendTestEmail();
