import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotStore } from '../../store/bot.store';
import { HistoryDataItem } from '@gemini-ai-bot/ui';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bot-session-detail-page',
  standalone: true,
  imports: [HistoryDataItem, CommonModule],
  templateUrl: './session-detail-page.html',
  styleUrl: './session-detail-page.css',
})
export class SessionDetail implements OnInit, OnDestroy {
  public readonly store = inject(BotStore);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      this.store.state.messages();
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.store.loadSessionById(sessionId);
    }

  }

  sendMessage(input: HTMLTextAreaElement) {
    if (!input.value.trim()) return;
    this.store.sendMessage(input.value);
    input.value = '';
  }

  private scrollToBottom(): void {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  ngOnDestroy(): void {
    this.store.clearChat();
  }
}
