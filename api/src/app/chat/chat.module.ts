import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { GeminiAiService } from './services/gemini-ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatSession } from './entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, Message])],
  controllers: [ChatController],
  providers: [ChatService, GeminiAiService],
})
export class ChatModule {}
