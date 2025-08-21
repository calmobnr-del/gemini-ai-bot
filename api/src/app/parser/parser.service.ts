import { Injectable } from '@nestjs/common';

@Injectable()
export class ParserService {
  parse(text: string): Record<string, any> {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const result: any[] = [];
    let currentTopic: Record<string, any> | null = null;
    let proseBuffer = []; // To hold text before the first topic

    for (const line of lines) {
      // Check for a main topic (e.g., "1. **Нелітаючі птахи:** ...")
      const topicMatch = line.match(/^\d+\.\s+\*\*(.*?):\*\*\s*(.*)/);
      if (topicMatch) {
        if (currentTopic) {
          result.push(currentTopic);
        }
        currentTopic = {
          title: topicMatch[1].trim(),
          // Add the rest of the line as the beginning of the description
          description: topicMatch[2].trim(),
        };
        continue;
      }

      // If we are inside a topic, append the line to its description
      if (currentTopic) {
        currentTopic.description += ' ' + line.trim();
      } else {
        // If we haven't found a topic yet, store the line as intro prose
        proseBuffer.push(line.trim());
      }
    }

    // Add the last processed topic to the result
    if (currentTopic) {
      result.push(currentTopic);
    }

    const finalResult: Record<string, any> = {};
    if (proseBuffer.length > 0) {
      finalResult.introduction = proseBuffer.join(' ');
    }
    if (result.length > 0) {
      finalResult.topics = result;
    }

    // If nothing was parsed into topics or intro, return raw text
    if (Object.keys(finalResult).length === 0) {
      return { text: text };
    }

    return finalResult;
  }
}
