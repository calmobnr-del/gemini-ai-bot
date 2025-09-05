// This is the main response from the chat endpoint
export interface ChatResponse {
  reply: string; // The reply is now just a string
  sessionId: string;
}

// These two interfaces are NO LONGER NEEDED, you can delete them.
// export interface Reply { ... }
// export interface Topic { ... }

// This represents a single message in the UI
export interface ChatMessage {
  sender: 'User' | 'Bot';
  request?: string;
  response?: string; // The response is now a string
}

// This represents a full session fetched from the database
export interface ChatSession {
  id: string;
  createdAt: string;
  messages: {
    id: number;
    request: string;
    response: string; // The response for each message is also a string
  }[];
}
