import { create } from 'zustand';
import { Message, Conversation, MessageRole } from '../types/chat';

interface ChatState {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;

  // Messages
  messages: Message[];

  // Streaming state
  isStreaming: boolean;
  streamingContent: string;

  // UI state
  isSidebarOpen: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setActiveConversation: (id: string | null) => void;
  deleteConversation: (id: string) => void;

  // Message actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;

  // Streaming actions
  startStreaming: () => void;
  appendStreamContent: (chunk: string) => void;
  finishStreaming: (messageId: string) => void;
  stopStreaming: () => void;

  // UI actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Utility
  reset: () => void;
  getActiveConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  isSidebarOpen: true,

  // Conversation actions
  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  setActiveConversation: (id) =>
    set({ activeConversationId: id, messages: [] }),

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    })),

  // Message actions
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    })),

  // Streaming actions
  startStreaming: () =>
    set({
      isStreaming: true,
      streamingContent: '',
    }),

  appendStreamContent: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),

  finishStreaming: (messageId) =>
    set((state) => ({
      isStreaming: false,
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: state.streamingContent }
          : msg
      ),
      streamingContent: '',
    })),

  stopStreaming: () =>
    set({
      isStreaming: false,
      streamingContent: '',
    }),

  // UI actions
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Utility
  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      messages: [],
      isStreaming: false,
      streamingContent: '',
    }),

  getActiveConversation: () => {
    const state = get();
    return state.conversations.find((c) => c.id === state.activeConversationId);
  },
}));
