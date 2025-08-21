import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { Message } from '../entities/message.entity';
import { GeminiAiService, HistoryMessage } from './gemini-ai.service';
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
    }

    if (!session) {
      session = this.sessionRepository.create();
      await this.sessionRepository.save(session);
    }

    // 2. Fetch the message history for context
    const history = await this.messageRepository.find({
      where: { session: { id: session.id } },
      order: { id: 'ASC' },
    });

    // 3. Format the history for the Gemini API
    const formattedHistory: HistoryMessage[] = history.flatMap(msg => [
      { role: 'user', parts: [{ text: msg.request }] },
      { role: 'model', parts: [{ text: JSON.stringify(msg.response) }] }
    ]);

    // 4. Get the AI reply using the prompt and the history
    const aiReply = await this.geminiAiService.generateText(userMessage, formattedHistory);

    // 5. Save the new message to the database
    const message = this.messageRepository.create({
      request: userMessage,
      response: aiReply,
      session: session,
    });
    await this.messageRepository.save(message);

    // 6. Return the reply and the session ID
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
