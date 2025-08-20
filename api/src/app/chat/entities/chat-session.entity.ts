
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Using UUID for session IDs is a good practice

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.session)
  messages: Message[];
}
