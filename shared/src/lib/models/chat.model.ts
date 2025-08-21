
export interface ChatResponse {
  reply: Reply
  sessionId: string
}

export interface Reply {
  rawText: string
  parsedText: ParsedText
}

export interface ParsedText {
  introduction: string
  topics: Topic[]
}

export interface Topic {
  title: string
  description: string
}


export interface ChatMessage {
  sender: 'User' | 'Bot';
  request?: string; // Make text optional
  response?: ParsedText; // Make response optional
}

export interface ChatSession {
  id: string;
  createdAt: string;
  messages: {
    id: number;
    request: string;
    response: Reply;
  }[];
}
