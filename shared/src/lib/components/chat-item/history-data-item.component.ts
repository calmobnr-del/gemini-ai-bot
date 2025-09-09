import { Component, contentChild, effect, input, TemplateRef } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChatSession } from '@gemini-ai-bot/interfaces';

@Component({
  selector: 'lib-bot-history-item',
  imports: [DatePipe, NgTemplateOutlet],
  templateUrl: './history-data-item.component.html',
  styleUrl: './history-data-item.component.css',
})
export class HistoryDataItem {
  message = input<ChatSession | null |  undefined>(undefined);
  short = input<boolean>(false);

  readonly contentBtnTpl = contentChild('contentBtnTpl', { read: TemplateRef });

  constructor() {
    // effect(() => {
    //   console.log(this.message());
    // });
  }
}
