
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatSession } from './chat-session.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  request: string;

  @Column('text')
  response: string;

  @ManyToOne(() => ChatSession, (session) => session.messages)
  session: ChatSession;
}
