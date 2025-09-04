import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { HttpModule } from '@nestjs/axios';
import { MapService } from './map.service';
import { ChatModule } from '../chat/chat.module';
import { GeminiAiService } from '../gemini/gemini-ai.service';
import { ParserModule } from '../parser/parser.module';

@Module({
  imports:[HttpModule, ChatModule, ParserModule],
  controllers: [MapController],
  providers: [MapService, GeminiAiService],
})

export class MapModule {}
