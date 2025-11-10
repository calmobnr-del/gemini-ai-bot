import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { Message } from '../entities/message.entity';
import { GeminiAiService } from '../../gemini/gemini-ai.service';
import { HtmlSanitizerService } from './html-sanitizer.service';
import { HistoryMessage } from '@gemini-ai-bot/interfaces';
import { OpenAiService } from '../../openai/openai.service';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly geminiAiService: GeminiAiService,
    private readonly htmlSanitizerService: HtmlSanitizerService,
    private readonly openAiService: OpenAiService,
  ) {}

  async processMessage(userMessage: string, sessionId?: string) {
    let session: ChatSession;

    if (sessionId) {
      session = await this.sessionRepository.findOneBy({ id: sessionId });
    }

    if (!session) {
      session = this.sessionRepository.create();
      await this.sessionRepository.save(session);
    }

    const history = await this.messageRepository.find({
      where: { session: { id: session.id } },
      order: { id: 'ASC' },
    });

    const formattedHistory: HistoryMessage[] = history.flatMap((msg) => [
      { role: 'user', parts: [{ text: msg.request }] },
      { role: 'model', parts: [{ text: JSON.stringify(msg.response) }] },
    ]);

    // 1. Create a detailed system prompt
    const fullPrompt = `
    You are a helpful assistant. Please provide a clear and concise response to the following user message.
    Format your response using semantic HTML tags like <p>, <ul>, <li>, and <strong>.
    Do not include any <script> tags or inline JavaScript.
    User Message: "${userMessage}"
  `;

    let rawText: string;
    try {
      // Try Gemini first
      rawText = await this.geminiAiService.generateText(fullPrompt, formattedHistory);
    } catch (geminiError) {
      console.warn('Gemini failed, trying OpenAI as a fallback...', geminiError.message);
      // If Gemini fails, try OpenAI
      rawText = await this.openAiService.generateText(fullPrompt, formattedHistory);
    }

    const cleanedText = this.htmlSanitizerService.parseAiResponse(rawText);

    const aiReply = this.htmlSanitizerService.sanitize(cleanedText);

    const message = this.messageRepository.create({
      request: userMessage,
      response: aiReply,
      session: session,
    });
    await this.messageRepository.save(message);

    return {
      reply: aiReply,
      sessionId: session.id,
    };
  }

  async findAllSessions(): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      relations: ['messages'],
      order: { createdAt: 'DESC' }, // Show newest sessions first
    });
  }

  async findOneSession(sessionId: string): Promise<ChatSession> {
    return this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages'],
    });
  }

  async removeSession(sessionId: string): Promise<void> {
    // 1. First, delete all messages that belong to this session
    await this.messageRepository.delete({ session: { id: sessionId } });

    // 2. Now that the messages are gone, you can safely delete the session
    await this.sessionRepository.delete(sessionId);
  }
}
