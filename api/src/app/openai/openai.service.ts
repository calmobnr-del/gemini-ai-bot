import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { HistoryMessage } from '@gemini-ai-bot/interfaces'; // Use your shared interface

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in the .env file');
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * A generic method to get a raw text response from the OpenAI API.
   */
  async generateText(prompt: string, history: HistoryMessage[] = []): Promise<string> {
    try {
      // 1. Convert our standard HistoryMessage[] into OpenAI's format
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...history.map(msg => {
          // --- THIS IS THE FIX ---
          // Explicitly define the type of the role variable
          const role: 'user' | 'assistant' = msg.role === 'model' ? 'assistant' : 'user';
          return {
            role: role,
            content: msg.parts[0].text,
          };
        }),
        { role: 'user', content: prompt }, // Add the new user prompt
      ];

      // 2. Call the OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: messages,
      });

      // 3. Return the raw text response
      return completion.choices[0].message.content || '';

    } catch (error) {
      this.logger.error('Error generating text with OpenAI:', error);
      throw new ServiceUnavailableException('Failed to generate text with OpenAI.');
    }
  }
}


