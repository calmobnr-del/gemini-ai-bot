import { Injectable } from '@nestjs/common';


import sanitizeHtml = require('sanitize-html');

@Injectable()
export class HtmlSanitizerService {
  parseAiResponse(rawText: string): string {
    return rawText.replace(/```(html)?\n?/g, '').replace(/```/g, '').trim();
  }


  sanitize(dirtyHtml: string): string {
    return sanitizeHtml(dirtyHtml, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'em',
        'strong', 'a', 'ul', 'ol', 'li', 'br', 'div', 'span', 'img'
      ],
      allowedAttributes: {
        'a': ['href', 'name', 'target'],
        'img': ['src', 'alt']
      },
    });
  }
}
