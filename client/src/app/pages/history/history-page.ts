import { Component, inject, OnInit } from '@angular/core';
import { BotStore } from '../../store/bot.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bot-history',
  imports: [DatePipe],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export class HistoryPage implements OnInit {
  private store = inject(BotStore);

  public state = this.store.state;

  ngOnInit(): void {
    this.store.loadAllSessions();
  }

  deleteSession(sessionId: string): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.store.deleteSession(sessionId);
    }
  }
}
