import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ChatService {
  async sendMessage(message: string) {
    if (!message) throw new InternalServerErrorException('Mensaje vacío');

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Sos un asistente especializado en gimnasios. Solo respondé preguntas relacionadas al gimnasio (clases, rutinas, horarios, pagos, etc).',
              },
              { role: 'user', content: message },
            ],
            max_tokens: 300,
          }),
        },
      );

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content ?? 'No pude generar respuesta.'
      );
    } catch (error) {
      console.error('Error en chat service:', error);
      throw new InternalServerErrorException(
        'Error al procesar la solicitud de chat',
      );
    }
  }
}
