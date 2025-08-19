import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button, Header } from '@gemini-ai-bot/ui';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CounterServiceStore } from './store/counter.store';


@Component({
  imports: [RouterModule, Button, Header, Header],
  providers:[ ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'gemini-ai-bot';
  private http = inject(HttpClient);

  readonly store = inject(CounterServiceStore);
  private apiUrlChat = environment.apiUrlChat;

  constructor() {

    this.http.post<any>(this.apiUrlChat, {message: 'What are the best practices for learning a new programming language?'}).subscribe(data => {
      console.log(data);
    });
  }



}
