
export interface ChatResponse {
  reply: Reply
  sessionId: string
}


export interface Reply {
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
  response?: Reply; // Make response optional
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
