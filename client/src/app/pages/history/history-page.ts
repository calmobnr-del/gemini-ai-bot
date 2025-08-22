import { Component, inject, OnInit } from '@angular/core';
import { BotStore } from '../../store/bot.store';
import { Router } from '@angular/router';
import { HistoryDataItem } from '@gemini-ai-bot/ui';

@Component({
  selector: 'app-bot-history',
  imports: [HistoryDataItem],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export class HistoryPage implements OnInit {
  private store = inject(BotStore);
  private readonly router = inject(Router);

  public state = this.store.state;

  ngOnInit(): void {
    this.store.loadAllSessions();
  }

  deleteSession(sessionId: string): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.store.deleteSession(sessionId);
    }
  }

  goToSessionId(sessionId: string): void {
    this.router.navigate(['/history', sessionId]);
  }
}
