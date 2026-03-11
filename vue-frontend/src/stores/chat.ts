import { defineStore } from 'pinia';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    isConnected: false,
    username: localStorage.getItem('chat-username-vue') || null,
    typingUsers: new Set<string>(),
  }),
  actions: {
    setMessages(messages: Message[]) {
      this.messages = messages;
    },
    addMessage(message: Message) {
      this.messages.push(message);
    },
    setIsConnected(connected: boolean) {
      this.isConnected = connected;
    },
    setUsername(username: string) {
      localStorage.setItem('chat-username-vue', username);
      this.username = username;
    },
    addTypingUser(user: string) {
      this.typingUsers.add(user);
    },
    removeTypingUser(user: string) {
      this.typingUsers.delete(user);
    },
  },
});
