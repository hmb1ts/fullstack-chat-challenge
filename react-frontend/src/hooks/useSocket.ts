import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { setMessages, addMessage, setIsConnected, username, addTypingUser, removeTypingUser } = useChatStore();

  useEffect(() => {
    if (!username) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', username);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('history', (history) => {
      setMessages(history);
    });

    socket.on('message', (message) => {
      addMessage(message);
    });

    socket.on('user_typing', (user) => {
      addTypingUser(user);
    });

    socket.on('user_stop_typing', (user) => {
      removeTypingUser(user);
    });

    socket.on('notification', (text) => {
      // Handle notifications if wanted
      console.log('Notification:', text);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, setMessages, addMessage, setIsConnected, addTypingUser, removeTypingUser]);

  const sendMessage = (text: string) => {
    if (socketRef.current && text.trim()) {
      socketRef.current.emit('message', { user: username, text });
      socketRef.current.emit('stop_typing');
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (socketRef.current) {
      if (isTyping) {
        socketRef.current.emit('typing', username);
      } else {
        socketRef.current.emit('stop_typing');
      }
    }
  };

  return { sendMessage, sendTypingStatus };
};
