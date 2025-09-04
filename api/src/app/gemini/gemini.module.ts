import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiAiService } from './gemini-ai.service';

@Module({
  imports: [ConfigModule], // Import ConfigModule so GeminiAiService can use ConfigService
  providers: [GeminiAiService],
  exports: [GeminiAiService], // Export the service so other modules can import it
})
export class GeminiModule {}
