import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiAiService } from './gemini-ai.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, GeminiAiService],
})
export class ChatModule {}
