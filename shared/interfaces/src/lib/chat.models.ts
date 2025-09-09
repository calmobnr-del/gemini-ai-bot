
// For the Gemini API
export interface HistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// For your Chat API responses
export interface ChatResponse {
  reply: string;
  sessionId: string;
}

// For the UI and data stores
export interface ChatMessage {
  sender: 'User' | 'Bot';
  request?: string;
  response?: string;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  messages: {
    id: number;
    request: string;
    response: string;
  }[];
}
