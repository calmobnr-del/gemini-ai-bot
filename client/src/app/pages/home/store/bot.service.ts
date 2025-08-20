// in bot.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private http = inject(HttpClient);
  private apiUrlChat = environment.apiUrlChat;

  // Method to send a message to the backend
  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrlChat, { message });
  }
}
