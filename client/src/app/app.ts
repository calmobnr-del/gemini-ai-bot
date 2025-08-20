import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '@gemini-ai-bot/ui';

@Component({
  imports: [RouterModule, Header],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styles: '',
})
export class App {
}
