import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from '../stores/chat';

describe('Pinia Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should set the username correctly', () => {
    const store = useChatStore();
    store.setUsername('VueUser');
    expect(store.username).toBe('VueUser');
  });

  it('should add a message correctly', () => {
    const store = useChatStore();
    const msg = { id: '1', user: 'Bob', text: 'Hello', timestamp: '12:00' };
    store.addMessage(msg);
    expect(store.messages).toHaveLength(1);
    expect(store.messages[0]).toEqual(msg);
  });

  it('should handle typing status', () => {
    const store = useChatStore();
    store.addTypingUser('Alice');
    expect(store.typingUsers.has('Alice')).toBe(true);
    
    store.removeTypingUser('Alice');
    expect(store.typingUsers.has('Alice')).toBe(false);
  });
});
