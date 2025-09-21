import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey'),
    });
  }

  async askGymBot(message: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sos un asistente especializado en gimnasios.
          Solo respondé preguntas relacionadas con clases, horarios, instructores,
          musculación, entrenamientos, reservas, nutrición básica y servicios del gimnasio.
          Si te preguntan algo fuera de esos temas, respondé:
          "Lo siento, solo puedo responder consultas relacionadas con el gimnasio."`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return (
      completion.choices[0].message.content ??
      'No tengo respuesta en este momento.'
    );
  }
}
