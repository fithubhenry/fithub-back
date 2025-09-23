import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Enviar mensaje al chat de IA con contexto opcional',
  })
  @ApiBody({ type: ChatDto })
  @ApiResponse({
    status: 201,
    description: 'Respuesta generada por IA',
    schema: {
      example: { reply: 'Mañana tenés Yoga a las 18hs y Spinning a las 19hs.' },
    },
  })
  async sendMessage(@Body() body: ChatDto) {
    return {
      reply: await this.chatService.sendMessage(body.message, body.context),
    };
  }
}
