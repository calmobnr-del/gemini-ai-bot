import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@gemini-ai-bot/ui';

@Component({
  imports: [RouterModule, Header, Footer],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styles: '',
})
export class App {}
