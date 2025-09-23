import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch'; // si tu Node ya es 18+, podés borrar este import y usar fetch nativo

@Injectable()
export class ChatService {
  async sendMessage(message: string, context?: string) {
    if (!message) throw new InternalServerErrorException('Mensaje vacío');

    try {
      const systemMessage = {
        role: 'system',
        content:
          'Sos un asistente especializado en gimnasios. Solo respondé preguntas relacionadas al gimnasio (clases, rutinas, horarios, pagos, etc).',
      };

      const contextMessage = context
        ? { role: 'system', content: `Información del gimnasio:\n${context}` }
        : null;

      const messages = [systemMessage];
      if (contextMessage) messages.push(contextMessage);
      messages.push({ role: 'user', content: message });

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
      console.log('Respuesta OpenAI:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error en chat service:', error);
      throw new InternalServerErrorException(
        'Error al procesar la solicitud de chat',
      );
    }
  }
}
