import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiAiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in the .env file");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string): Promise<string> {
    try {
      // Get the generative model
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

      // Generate content based on the prompt
      const result = await model.generateContent(prompt);
      const response = await result.response;

      return response.text();
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text with Gemini AI.');
    }
  }
}
