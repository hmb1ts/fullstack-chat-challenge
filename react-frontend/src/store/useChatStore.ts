import { create } from 'zustand';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  username: string | null;
  typingUsers: Set<string>;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsConnected: (connected: boolean) => void;
  setUsername: (username: string) => void;
  addTypingUser: (user: string) => void;
  removeTypingUser: (user: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  username: localStorage.getItem('chat-username') || null,
  typingUsers: new Set(),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setUsername: (username) => {
    localStorage.setItem('chat-username', username);
    set({ username });
  },
  addTypingUser: (user) => set((state) => {
    const newTypingUsers = new Set(state.typingUsers);
    newTypingUsers.add(user);
    return { typingUsers: newTypingUsers };
  }),
  removeTypingUser: (user) => set((state) => {
    const newTypingUsers = new Set(state.typingUsers);
    newTypingUsers.delete(user);
    return { typingUsers: newTypingUsers };
  }),
}));
