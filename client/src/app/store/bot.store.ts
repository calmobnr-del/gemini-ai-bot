import { Injectable, inject } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { BotService } from './bot.service';
import { tap } from 'rxjs';
import { ChatMessage, ChatSession } from '@gemini-ai-bot/ui';

interface BotState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  selectedSession: ChatSession | null;
  sessions: ChatSession[];
}

const initialState: BotState = {
  messages: [],
  loading: false,
  error: null,
  sessionId: null,
  selectedSession: null,
  sessions: [],
};

@Injectable({ providedIn: 'root' })
export class BotStore {
  private botService = inject(BotService);
  readonly state = signalState<BotState>(initialState);

  sendMessage(message: string) {
    const currentSessionId = this.state.sessionId();

    patchState(this.state, {
      loading: true,
      messages: [...this.state.messages(), { request: message, sender: 'User' }],
    });

    this.botService
      .sendMessage({ message, sessionId: currentSessionId ?? undefined })
      .pipe(
        tap({
          next: (response) => {
            patchState(this.state, {
              loading: false,
              sessionId: response.sessionId,
              messages: [...this.state.messages(), { response: response.reply, sender: 'Bot' }],
            });
          },
          error: (e) => patchState(this.state, { loading: false, error: e.message }),
        }),
      )
      .subscribe();
  }

  loadAllSessions() {
    patchState(this.state, { loading: true });
    this.botService
      .getAllSessions()
      .pipe(
        tap({
          next: (sessions) => patchState(this.state, { loading: false, sessions }),
          error: (e) => patchState(this.state, { loading: false, error: e.message }),
        }),
      )
      .subscribe();
  }

  deleteSession(sessionId: string) {
    this.botService
      .deleteSession(sessionId)
      .pipe(
        tap({
          next: () => {
            patchState(this.state, {
              sessions: this.state.sessions().filter((s) => s.id !== sessionId),
            });
          },
          error: (e) => patchState(this.state, { error: e.message }),
        }),
      )
      .subscribe();
  }

  loadSessionById(sessionId: string) {
    patchState(this.state, { loading: true, selectedSession: null, messages: [] });
    this.botService
      .getSessionById(sessionId)
      .pipe(
        tap({
          next: (session) => {
            const uiMessages: ChatMessage[] = session.messages.flatMap((msg) => [
              { sender: 'User', request: msg.request },
              { sender: 'Bot', response: msg.response },
            ]);
            patchState(this.state, {
              loading: false,
              selectedSession: session,
              sessionId: session.id,
              messages: uiMessages,
            });
          },
          error: (e) => patchState(this.state, { loading: false, error: e.message }),
        }),
      )
      .subscribe();
  }

  clearChat() {
    patchState(this.state, {
      messages: [],
      sessionId: null,
      error: null,
    });
  }
}
