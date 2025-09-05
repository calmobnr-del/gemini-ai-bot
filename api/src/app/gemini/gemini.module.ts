import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiAiService } from './gemini-ai.service';

@Module({
  imports: [ConfigModule],
  providers: [GeminiAiService],
  exports: [GeminiAiService], // Export the service so other modules can import it
})
export class GeminiModule {}
