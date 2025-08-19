import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from '@gemini-ai-bot/ui';
import { Header } from '../../../shared/src/lib/components/header/header';


@Component({
  imports: [RouterModule, Button, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'gemini-ai-bot';
}
