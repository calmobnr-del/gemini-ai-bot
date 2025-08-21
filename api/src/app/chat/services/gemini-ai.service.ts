import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ParserService } from '../../parser/parser.service';
import { logger } from 'nx/src/utils/logger';

export interface HistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable()
export class GeminiAiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService, private readonly parserService: ParserService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in the .env file");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, history: HistoryMessage[] = []): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Start a chat with the provided history
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);

      const response =   result.response;
      const rawText = response.text();

      return this.parserService.parse(rawText);
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text with Gemini AI.');
    }
  }
}
