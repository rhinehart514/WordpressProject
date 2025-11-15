'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/lib/store/chat-store';
import { ChatAPI } from '@/lib/api/chat-api';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatSidebar() {
  const {
    conversations,
    activeConversationId,
    isSidebarOpen,
    setConversations,
    setActiveConversation,
    deleteConversation,
    toggleSidebar,
    reset,
  } = useChatStore();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await ChatAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleNewChat = () => {
    setActiveConversation(null);
    reset();
  };

  const handleSelectConversation = async (id: string) => {
    try {
      const conversation = await ChatAPI.getConversation(id);
      setActiveConversation(id);

      // You would also load messages here and set them in the store
      // For now, messages will be loaded by the parent component
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Delete this conversation?')) return;

    try {
      await ChatAPI.deleteConversation(id);
      deleteConversation(id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-64 border-r border-ai-border bg-ai-dark-900 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ai-border">
            <h2 className="text-lg font-semibold text-ai-dark-50">Chats</h2>
            <button
              onClick={toggleSidebar}
              className="text-ai-dark-400 hover:text-ai-dark-200 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 rounded-lg bg-ai-dark-800 px-4 py-3 text-ai-dark-50 transition-colors hover:bg-ai-dark-700"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {conversations.length === 0 ? (
              <p className="text-center text-sm text-ai-dark-400 py-8">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`group w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeConversationId === conversation.id
                        ? 'bg-ai-dark-700 text-ai-dark-50'
                        : 'text-ai-dark-300 hover:bg-ai-dark-800'
                    }`}
                  >
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 flex-shrink-0"
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
                        <span className="truncate">
                          {conversation.title || 'New Conversation'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-ai-dark-600 rounded transition-opacity"
                    >
                      <svg
                        className="h-4 w-4 text-ai-dark-400 hover:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
