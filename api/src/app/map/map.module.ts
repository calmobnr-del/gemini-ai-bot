import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { HttpModule } from '@nestjs/axios';
import { MapService } from './map.service';
import { ChatModule } from '../chat/chat.module';
import { ParserModule } from '../parser/parser.module';
import { GeminiAiService } from '../gemini/gemini-ai.service';
import { GeocodingService } from './geocoding.service';

@Module({
  imports: [HttpModule, ChatModule, ParserModule],
  controllers: [MapController],
  providers: [MapService, GeminiAiService, GeocodingService],
})
export class MapModule {}
