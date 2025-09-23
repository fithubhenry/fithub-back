import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch'; // si Node >= 18, podés usar fetch nativo
import { FITHUB_CONTEXT } from 'src/helpers/fithub-context';

@Injectable()
export class ChatService {
  async sendMessage(message: string) {
    if (!message) throw new InternalServerErrorException('Mensaje vacío');

    try {
      // ⚡ Usamos solo FITHUB_CONTEXT importado
      const systemMessage = {
        role: 'system',
        content: FITHUB_CONTEXT,
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
