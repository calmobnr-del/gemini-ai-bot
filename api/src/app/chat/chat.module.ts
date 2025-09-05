import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { GeminiAiService } from '../gemini/gemini-ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ParserModule } from '../parser/parser.module';
import { HtmlSanitizerService } from './services/html-sanitizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, Message]), ParserModule],
  controllers: [ChatController],
  providers: [ChatService, GeminiAiService, HtmlSanitizerService],
})
export class ChatModule {}
