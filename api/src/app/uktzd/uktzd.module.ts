import { Module } from '@nestjs/common';
import { UktzedService } from './uktzd.service';
import { UktzedController } from './uktzd.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [GeminiModule, OpenAiModule], // Make AI services available
  providers: [UktzedService],
  controllers: [UktzedController],
})
export class UktzedModule {}
