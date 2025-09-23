import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';

class ChatDto {
  message: string;
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar mensaje al chat de IA' })
  @ApiBody({ type: ChatDto, description: 'Mensaje del usuario' })
  @ApiResponse({
    status: 201,
    description: 'Respuesta del chat',
    schema: { example: { reply: 'Texto de respuesta de IA' } },
  })
  async sendMessage(@Body() body: ChatDto) {
    return { reply: await this.chatService.sendMessage(body.message) };
  }
}
