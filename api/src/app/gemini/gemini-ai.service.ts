import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadGatewayException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { CoordinatesResponseDto } from '../map/dto/get-coordinates.dto';
import { HistoryMessage } from '@gemini-ai-bot/interfaces';

@Injectable()
export class GeminiAiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiAiService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set in the .env file');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, history: HistoryMessage[] = []): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // startChat is used here. It works perfectly even if the history array is empty.
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);

      return result.response.text();
    } catch (error) {
      this.logger.error('Error generating text:', error);
      throw new ServiceUnavailableException('Failed to generate text with Gemini AI.');
    }
  }

  async getCoordinates(prompt: string): Promise<CoordinatesResponseDto> {
    const rawText = await this.generateText(prompt);
    try {
      const cleanedText = rawText
        .replace(/```(json)?\n?/g, '')
        .replace(/```/g, '')
        .trim();
      const coords: CoordinatesResponseDto = JSON.parse(cleanedText);
      if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
        throw new Error('Invalid coordinates format from AI.');
      }
      return coords;
    } catch (error) {
      this.logger.error(
        'Failed to parse coordinates from Gemini response.',
        `Raw text was: ${rawText}`,
      );
      throw new BadGatewayException('The AI service returned an invalid coordinates format.');
    }
  }

  async getGeometry(prompt: string): Promise<any> {
    const rawText = await this.generateText(prompt);

    try {
      // 1. Find the JSON block within the raw text using a regular expression.
      // This looks for the first '{' to the last '}' and everything in between.
      const jsonMatch = rawText.match(/{[\s\S]*}/);

      if (!jsonMatch) {
        // Throw an error if no JSON object is found at all.
        throw new Error('No valid JSON object found in the AI response.');
      }

      const jsonString = jsonMatch[0];
      const geoJson = JSON.parse(jsonString);

      // 2. Validate the structure (this logic is the same as before)
      if (
        geoJson.type !== 'Feature' ||
        typeof geoJson.geometry !== 'object' ||
        !geoJson.geometry.coordinates
      ) {
        throw new Error('Response from AI is not a valid GeoJSON Feature.');
      }

      return geoJson;
    } catch (error) {
      this.logger.error(
        'Failed to get or parse geometry from Gemini.',
        `Raw text was: "${rawText}"`,
        error.stack,
      );
      throw new BadGatewayException(
        'The AI service returned an invalid or unparsable GeoJSON response.',
      );
    }
  }
}
