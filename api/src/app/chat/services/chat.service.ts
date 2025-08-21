import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { Message } from '../entities/message.entity';
import { GeminiAiService } from './gemini-ai.service';
import { logger } from 'nx/src/utils/logger';

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
