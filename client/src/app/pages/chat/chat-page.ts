import { Component, inject, OnDestroy } from '@angular/core';
import { BotStore } from '../../store/bot.store';

@Component({
  selector: 'app-bot-chat',
  imports: [],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
})
export class ChatPage implements OnDestroy {
  private store = inject(BotStore);

  public state = this.store.state;

  sendMessage(input: HTMLTextAreaElement) {
    if (!input.value) return;
    this.store.sendMessage(input.value);
    input.value = '';
  }

  constructor() {
    // effect(() => {
    //   console.log(this.state().messages);
    // });
  }

  ngOnDestroy(): void {
    this.store.clearChat();
  }
}
