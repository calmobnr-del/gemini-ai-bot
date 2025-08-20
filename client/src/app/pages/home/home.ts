import { Component, inject } from '@angular/core';
import { BotStore } from './store/bot.store';

@Component({
  selector: 'app-bot-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly store = inject(BotStore);

  readonly messages = this.store.state.messages;

  sendMessage(input: HTMLTextAreaElement) {
    if (!input.value) return;
    this.store.sendMessage(input.value);
    input.value = '';
  }
}
