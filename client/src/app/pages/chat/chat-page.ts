import { Component, inject } from '@angular/core';
import { BotStore } from '../../store/bot.store';

@Component({
  selector: 'app-bot-chat',
  imports: [],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
})
export class ChatPage {
  private store = inject(BotStore);

  public state = this.store.state;

  sendMessage(input: HTMLTextAreaElement) {
    if (!input.value) return;
    this.store.sendMessage(input.value);
    input.value = '';
  }
}
