import { Component, contentChild, effect, input, TemplateRef } from '@angular/core';
import { ChatSession } from '../../models';
import { DatePipe, JsonPipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-bot-history-item',
  imports: [JsonPipe, DatePipe, NgTemplateOutlet],
  templateUrl: './history-data-item.component.html',
  styleUrl: './history-data-item.component.css',
})
export class HistoryDataItem {
  message = input<ChatSession | undefined>(undefined);
  short = input<boolean>(false);

  readonly contentBtnTpl = contentChild('contentBtnTpl', { read: TemplateRef });

  constructor() {
    // effect(() => {
    //   console.log(this.message());
    // });
  }
}
