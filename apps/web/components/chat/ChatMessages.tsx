'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store/chat-store';
import { ChatMessage } from './ChatMessage';
import { motion } from 'framer-motion';

export function ChatMessages() {
  const { messages, isStreaming, streamingContent } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ai-dark-700">
              <svg
                className="h-8 w-8 text-ai-accent-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-ai-dark-50 mb-2">
            Start a conversation
          </h3>
          <p className="text-ai-dark-400 max-w-md">
            Send a message to begin. I can help you analyze restaurant websites, generate previews, and deploy to WordPress.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="mx-auto max-w-3xl">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const showStreaming = isLastMessage && isStreaming && message.role === 'assistant';

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={showStreaming}
              streamingContent={streamingContent}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
