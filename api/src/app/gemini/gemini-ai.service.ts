import { Injectable, Logger  } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ParserService } from '../parser/parser.service';
import { CoordinatesResponseDto } from '../map/dto/get-coordinates.dto';

export interface HistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable()
export class GeminiAiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiAiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly parserService: ParserService,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set in the .env file');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, history: HistoryMessage[] = []): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Start a chat with the provided history
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);

      const response = result.response;
      const rawText = response.text();

      return this.parserService.parse(rawText);
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text with Gemini AI.');
    }
  }


  async parseCoordinates(prompt: string): Promise<CoordinatesResponseDto> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const rawText = response.text();

      // Log the raw response BEFORE parsing. This is the most important step for debugging.
      this.logger.log(`Gemini raw response: --->${rawText}<---`);

      try {
        // Sometimes the AI wraps the JSON in markdown backticks. We can clean that up.
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedJson: CoordinatesResponseDto = JSON.parse(cleanedText);
        return parsedJson;
      } catch (parseError) {
        // Log the error and the problematic text.
        this.logger.error('Failed to parse JSON from Gemini response.', `Raw text was: ${rawText}`);
        throw new Error('Invalid JSON format received from the AI.');
      }
    } catch (error) {
      this.logger.error('Error communicating with Gemini API:', error);
      throw new Error('Failed to generate coordinates with Gemini AI.');
    }
  }
}
