export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: any;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title?: string;
  userId?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface StreamEvent {
  type: 'conversation_id' | 'message_id' | 'content' | 'done';
  data: any;
}
