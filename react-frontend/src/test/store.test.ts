import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../store/useChatStore';

describe('Zustand Chat Store', () => {
  beforeEach(() => {
    // Manually reset state because Zustand is a singleton in this context
    useChatStore.setState({
      messages: [],
      isConnected: false,
      username: null,
      typingUsers: new Set(),
    });
  });

  it('should set the username correctly', () => {
    const { setUsername } = useChatStore.getState();
    setUsername('TestUser');
    expect(useChatStore.getState().username).toBe('TestUser');
  });

  it('should add a message correctly', () => {
    const { addMessage } = useChatStore.getState();
    const msg = { id: '1', user: 'Alice', text: 'Hi', timestamp: '10:00' };
    addMessage(msg);
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0]).toEqual(msg);
  });

  it('should manage typing users correctly', () => {
    const { addTypingUser, removeTypingUser } = useChatStore.getState();
    addTypingUser('Bob');
    expect(useChatStore.getState().typingUsers.has('Bob')).toBe(true);
    
    removeTypingUser('Bob');
    expect(useChatStore.getState().typingUsers.has('Bob')).toBe(false);
  });
});
