import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatResponse, ChatSession } from '@gemini-ai-bot/ui';



export interface ChatPayload {
  message: string;
  sessionId?: string;
}


//
// export interface ChatResponse {
//   reply: string;
//   sessionId: string;
// }



@Injectable({ providedIn: 'root' })
export class BotService {
  private http = inject(HttpClient);
  private apiUrlChat = environment.apiUrlChat;

  sendMessage(payload: ChatPayload): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrlChat, payload);
  }

  getAllSessions(): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(`${this.apiUrlChat}/sessions`);
  }

  getSessionById(sessionId: string): Observable<ChatSession> {
    return this.http.get<ChatSession>(`${this.apiUrlChat}/sessions/${sessionId}`);
  }

  deleteSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlChat}/sessions/${sessionId}`);
  }
}
