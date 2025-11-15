'use client';

import { useChatStore } from '@/lib/store/chat-store';
import { ChatSidebar, ChatMessages, ChatInput } from '@/components/chat';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export default function ChatPage() {
  const { isSidebarOpen, toggleSidebar, setActiveConversation, reset } = useChatStore();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'b',
      metaKey: true,
      handler: toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: 'k',
      metaKey: true,
      handler: () => {
        setActiveConversation(null);
        reset();
      },
      description: 'New conversation',
    },
  ]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-ai-dark-800">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-ai-border bg-ai-dark-700 px-4 py-3">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="text-ai-dark-400 hover:text-ai-dark-200 transition-colors"
                aria-label="Open sidebar"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-accent-500">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-ai-dark-50">
                AI Website Rebuilder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-ai-dark-400">
              Powered by GPT-4
            </span>
          </div>
        </header>

        {/* Messages Area */}
        <ChatMessages />

        {/* Input Area */}
        <ChatInput />
      </div>
    </div>
    </ErrorBoundary>
  );
}
