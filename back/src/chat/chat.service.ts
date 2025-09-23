import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch'; // si tu Node ya es 18+, podés borrar este import y usar fetch nativo
import { FITHUB_CONTEXT } from 'src/helpers/fithub-context';

@Injectable()
export class ChatService {
  async sendMessage(message: string) {
    if (!message) throw new InternalServerErrorException('Mensaje vacío');

    try {
      // Unificamos todo el contexto en un solo systemMessage
      const systemMessage = {
        role: 'system',
        content: `
Sos un asistente oficial de FitHub, una cadena de gimnasios moderna. 
Siempre respondé preguntas relacionadas a FitHub (clases, rutinas, horarios, pagos, membresías, reservas, instructores, horarios, contacto, políticas y beneficios).
No contestes preguntas fuera de este contexto y, si el usuario pregunta algo irrelevante, redirígelo educadamente a temas relacionados con FitHub.

${FITHUB_CONTEXT}
        `,
      };

      const messages = [systemMessage, { role: 'user', content: message }];

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
            messages,
            max_tokens: 300,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        console.error('Error OpenAI:', data.error);
        throw new InternalServerErrorException(data.error.message);
      }

      const reply =
        data.choices?.[0]?.message?.content ?? 'No pude generar respuesta.';

      return { reply };
    } catch (error) {
      console.error('Error en chat service:', error);
      throw new InternalServerErrorException(
        'Error al procesar la solicitud de chat',
      );
    }
  }
}
