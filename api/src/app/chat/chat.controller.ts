import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Handles incoming chat messages.
   * Creates a new session if sessionId is not provided.
   */
  @Post()
  async handleChat(@Body() createChatDto: CreateChatDto) {
    const { message, sessionId } = createChatDto;
    return this.chatService.processMessage(message, sessionId);
  }

  @Get('sessions')
  findAllSessions() {
    return this.chatService.findAllSessions();
  }

  @Get('sessions/:sessionId')
  findOneSession(@Param('sessionId') sessionId: string) {
    return this.chatService.findOneSession(sessionId);
  }

  @Delete('sessions/:sessionId')
  removeSession(@Param('sessionId') sessionId: string) {
    return this.chatService.removeSession(sessionId);
  }
}
