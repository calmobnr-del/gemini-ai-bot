import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { Message } from '../entities/message.entity';
import { GeminiAiService } from './gemini-ai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly geminiAiService: GeminiAiService
  ) {}

  async processMessage(userMessage: string, sessionId?: string) {
    let session: ChatSession;

    if (sessionId) {
      session = await this.sessionRepository.findOneBy({ id: sessionId });
    } else {
      session = this.sessionRepository.create();
      await this.sessionRepository.save(session);
    }

    if (!session) {
      throw new Error('Failed to create or find session');
    }

    const aiReply = await this.geminiAiService.generateText(userMessage);

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

  /**
   * Retrieves all chat sessions with their related messages.
   * @returns A promise that resolves to an array of ChatSession entities.
   */
  async findAllSessions(): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      relations: ['messages'],
      order: { createdAt: 'DESC' }, // Show newest sessions first
    });
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }
}
