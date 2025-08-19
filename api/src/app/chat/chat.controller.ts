import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { GeminiAiService } from './gemini-ai.service';

@Controller('chat')
export class ChatController {

  constructor(private readonly geminiAiService: GeminiAiService) {
  }

  @Post()
  async create(@Body() createChatDto: CreateChatDto) {
    const userMessage = createChatDto.message;
    const aiReply = await this.geminiAiService.generateText(userMessage);

    return {
      reply: aiReply
    }
  }
}
