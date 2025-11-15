'use client';

import { memo } from 'react';
import { Message } from '@/lib/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
}

export const ChatMessage = memo(function ChatMessage({ message, isStreaming, streamingContent }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const content = isStreaming && !isUser ? streamingContent || message.content : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 p-6 ${
        isUser ? 'bg-ai-dark-700' : 'bg-ai-dark-600'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
            isUser
              ? 'bg-ai-accent-500 text-white'
              : 'bg-ai-dark-800 text-ai-dark-200'
          }`}
        >
          {isUser ? 'U' : 'AI'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isUser ? (
          <p className="text-ai-dark-50 whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom code block styling
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const inline = props.inline;
                  return !inline ? (
                    <pre className="bg-ai-dark-800 rounded-lg p-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code
                      className="bg-ai-dark-800 px-1.5 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Custom link styling
                a({ node, children, ...props }) {
                  return (
                    <a
                      className="text-ai-accent-500 hover:text-ai-accent-400 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Streaming cursor */}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-ai-accent-500 animate-pulse ml-1" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});
