import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { GeminiAiService } from '../gemini/gemini-ai.service';
import { OpenAiService } from '../openai/openai.service';
import { UktzedResponse } from '@gemini-ai-bot/interfaces';
import { uktzedPrompt } from './prompt';

@Injectable()
export class UktzedService {
  private readonly logger = new Logger(UktzedService.name);

  constructor(
    private readonly geminiAiService: GeminiAiService,
    private readonly openAiService: OpenAiService,
  ) {}

  async getUktzedCode(userMessage: string): Promise<UktzedResponse> {
    const fullPrompt = uktzedPrompt(userMessage);

    let rawText: string;
    try {
      rawText = await this.geminiAiService.generateText(fullPrompt, []);
    } catch (geminiError) {
      console.warn('Gemini failed, trying OpenAI as a fallback...', geminiError.message);
      rawText = await this.openAiService.generateText(fullPrompt, []);
    }

    // Parse the JSON string
    try {
      // Find the JSON block, even if the AI adds text
      const jsonMatch = rawText.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in AI response.');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      this.logger.error('Failed to parse UKTZED JSON from AI', parseError.stack, rawText);
      throw new BadGatewayException('The AI service returned an invalid JSON response.');
    }
  }
}
