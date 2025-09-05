import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ChatSession } from './chat-session.entity';
import { forwardRef } from '@nestjs/common';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  request: string;

  // Change the column type from 'jsonb' to 'text' to store the HTML string
  @Column({ type: 'text' })
  response: string;

  @ManyToOne(() => ChatSession, (session) => session.messages)
  session: ChatSession;

  @CreateDateColumn()
  createdAt: Date;
}
