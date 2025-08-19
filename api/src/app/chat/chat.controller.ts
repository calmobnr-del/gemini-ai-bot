import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    const userMessage = createChatDto.message;

    return {
      reply: 'You said: ' + userMessage + '',
    }
  }
}
