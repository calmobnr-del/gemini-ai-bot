import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './services/chat.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Handles incoming chat messages.
   * Creates a new session if sessionId is not provided.
   */
  @Post()
  @ApiOperation({ summary: 'Send a message to the bot and get a reply' })
  async handleChat(@Body() createChatDto: CreateChatDto) {
    const { message, sessionId } = createChatDto;
    return this.chatService.processMessage(message, sessionId);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get a list of all chat sessions' })
  findAllSessions() {
    return this.chatService.findAllSessions();
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get a specific chat session' })
  findOneSession(@Param('sessionId') sessionId: string) {
    return this.chatService.findOneSession(sessionId);
  }

  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: 'Delete a specific chat session' })
  removeSession(@Param('sessionId') sessionId: string) {
    return this.chatService.removeSession(sessionId);
  }
}
