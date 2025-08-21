import { Component, inject, OnInit } from '@angular/core';
import { BotStore } from '../../store/bot.store';
import { ActivatedRoute } from '@angular/router';
import { HistoryDataItem } from '@gemini-ai-bot/ui';

@Component({
  selector: 'app-bot-session-detail-page',
  imports: [HistoryDataItem],
  templateUrl: './session-detail-page.html',
  styleUrl: './session-detail-page.css',
})
export class SessionDetail implements OnInit {
  public readonly store = inject(BotStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.store.loadSessionById(sessionId);
    }
  }
}
