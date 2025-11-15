'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChatStore } from '@/lib/store/chat-store';
import { ChatAPI } from '@/lib/api/chat-api';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    activeConversationId,
    isStreaming,
    addMessage,
    startStreaming,
    appendStreamContent,
    finishStreaming,
    stopStreaming,
    setActiveConversation,
    addConversation,
  } = useChatStore();

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message optimistically
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId || '',
      role: 'user' as const,
      content: userMessage,
      createdAt: new Date(),
    };

    addMessage(tempUserMessage);
    startStreaming();

    try {
      let currentConversationId = activeConversationId;
      let assistantMessageId = '';

      // Stream the response
      for await (const event of ChatAPI.sendMessageStream(
        userMessage,
        activeConversationId || undefined
      )) {
        if (event.type === 'conversation_id') {
          currentConversationId = event.data;
          setActiveConversation(event.data);

          // Add conversation to list
          addConversation({
            id: event.data,
            title: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (event.type === 'message_id') {
          assistantMessageId = event.data;

          // Add placeholder assistant message
          addMessage({
            id: assistantMessageId,
            conversationId: currentConversationId || '',
            role: 'assistant',
            content: '',
            createdAt: new Date(),
          });
        } else if (event.type === 'content') {
          appendStreamContent(event.data);
        } else if (event.type === 'done') {
          finishStreaming(assistantMessageId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      stopStreaming();
    }
  };

  const handleStop = () => {
    stopStreaming();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-ai-border bg-ai-dark-700 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isStreaming}
            minRows={1}
            maxRows={10}
            className="flex-1 resize-none rounded-lg bg-ai-dark-600 px-4 py-3 text-ai-dark-50 placeholder-ai-dark-400 focus:outline-none focus:ring-2 focus:ring-ai-accent-500 disabled:opacity-50"
          />

          {isStreaming ? (
            <button
              onClick={handleStop}
              className="flex h-12 px-4 items-center justify-center gap-2 rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="6" width="12" height="12" />
              </svg>
              <span className="text-sm font-medium">Stop</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-ai-accent-500 text-white transition-colors hover:bg-ai-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-ai-dark-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
