import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body('message') message: string) {
    const reply = await this.chatService.askGymBot(message);
    return { reply };
  }
}
