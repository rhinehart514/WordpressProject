import { Conversation, Message, StreamEvent } from '../types/chat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ChatAPI {
  /**
   * Send a message with streaming response
   */
  static async *sendMessageStream(
    content: string,
    conversationId?: string,
    userId?: string
  ): AsyncIterable<StreamEvent> {
    const response = await fetch(`${API_URL}/chat/message/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        conversationId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data) {
              try {
                const event: StreamEvent = JSON.parse(data);
                yield event;
              } catch (e) {
                console.error('Failed to parse SSE data:', data);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Send a message (non-streaming)
   */
  static async sendMessage(
    content: string,
    conversationId?: string,
    userId?: string
  ): Promise<{
    conversationId: string;
    messageId: string;
    content: string;
    role: string;
  }> {
    const response = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        conversationId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all conversations
   */
  static async getConversations(
    userId?: string,
    limit?: number
  ): Promise<Conversation[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(
      `${API_URL}/chat/conversations?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    title?: string,
    userId?: string
  ): Promise<Conversation> {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get a conversation with messages
   */
  static async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(`${API_URL}/chat/conversations/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/chat/conversations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Get messages for a conversation
   */
  static async getMessages(
    conversationId: string,
    cursor?: string,
    limit?: number
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(
      `${API_URL}/chat/conversations/${conversationId}/messages?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
