import { onMounted, onUnmounted, ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/chat';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const store = useChatStore();

  const connect = () => {
    if (!store.username) return;

    socket.value = io(SOCKET_URL);

    socket.value.on('connect', () => {
      store.setIsConnected(true);
      socket.value?.emit('join', store.username);
    });

    socket.value.on('disconnect', () => {
      store.setIsConnected(false);
    });

    socket.value.on('history', (history) => {
      store.setMessages(history);
    });

    socket.value.on('message', (message) => {
      store.addMessage(message);
    });

    socket.value.on('user_typing', (user) => {
      store.addTypingUser(user);
    });

    socket.value.on('user_stop_typing', (user) => {
      store.removeTypingUser(user);
    });
  };

  const sendMessage = (text: string) => {
    if (socket.value && text.trim()) {
      socket.value.emit('message', { user: store.username, text });
      socket.value.emit('stop_typing');
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (socket.value) {
      if (isTyping) {
        socket.value.emit('typing', store.username);
      } else {
        socket.value.emit('stop_typing');
      }
    }
  };

  onMounted(() => {
    if (store.username) connect();
  });

  onUnmounted(() => {
    socket.value?.disconnect();
  });

  return { sendMessage, connect, sendTypingStatus };
}
