import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './openai.service';

@Module({
  imports: [ConfigModule], // Needs ConfigModule to read the API key
  providers: [OpenAiService],
  exports: [OpenAiService], // Export the service
})
export class OpenAiModule {}
