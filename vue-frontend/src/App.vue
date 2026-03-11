<script setup lang="ts">
import { ref, onUpdated, nextTick, watch } from 'vue';
import { useChatStore } from './stores/chat';
import { useSocket } from './composables/useSocket';

const store = useChatStore();
const { sendMessage, connect, sendTypingStatus } = useSocket();

const inputValue = ref('');
const tempName = ref('');
const messagesEndRef = ref<HTMLElement | null>(null);
let typingTimeout: any = null;

const scrollToBottom = () => {
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};

watch(() => [store.messages, store.typingUsers], () => {
  nextTick(() => scrollToBottom());
}, { deep: true });

const handleInputChange = () => {
  sendTypingStatus(true);
  if (typingTimeout) clearTimeout(typingTimeout);
  
  typingTimeout = setTimeout(() => {
    sendTypingStatus(false);
  }, 2000);
};

const handleLogin = () => {
  if (tempName.value.trim()) {
    store.setUsername(tempName.value.trim());
    connect();
  }
};

const handleSend = () => {
  if (inputValue.value.trim()) {
    sendMessage(inputValue.value);
    inputValue.value = '';
    if (typingTimeout) clearTimeout(typingTimeout);
  }
};
</script>

<template>
  <div v-if="!store.username" class="login-screen">
    <form class="login-card" @submit.prevent="handleLogin">
      <h1>🌊 Vue Chat</h1>
      <p>Enter your name to join the workspace</p>
      <input 
        v-model="tempName"
        type="text" 
        placeholder="Username..." 
        autofocus
      />
      <button type="submit" style="margin-top: 1.5rem; width: 100%; padding: 0.8rem;">
        Join Chat
      </button>
    </form>
  </div>

  <div v-else class="chat-container">
    <header class="chat-header">
      <div>
        <span style="font-size: 1.2rem; font-weight: 700;">Vue Chat</span>
        <div style="font-size: 0.8rem; opacity: 0.6;">Logged as: {{ store.username }}</div>
      </div>
      <div style="display: flex; align-items: center;">
        <span :class="['status-dot', store.isConnected ? 'status-connected' : 'status-disconnected']"></span>
        <span>{{ store.isConnected ? 'Connected' : 'Disconnected' }}</span>
      </div>
    </header>
    
    <div class="message-list">
      <div 
        v-for="msg in store.messages" 
        :key="msg.id" 
        :class="['message-item', msg.user === store.username ? 'message-own' : 'message-other']"
      >
        <div v-if="msg.user !== store.username" class="message-user">{{ msg.user }}</div>
        <div class="message-text">{{ msg.text }}</div>
        <div class="message-time">{{ msg.timestamp }}</div>
      </div>

      <div 
        v-for="user in store.typingUsers" 
        :key="user" 
        class="message-item message-other typing-indicator"
      >
        <div class="message-user">{{ user }} is typing...</div>
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div ref="messagesEndRef"></div>
    </div>

    <form class="chat-input" @submit.prevent="handleSend">
      <input 
        v-model="inputValue"
        @input="handleInputChange"
        type="text" 
        placeholder="Type a message..." 
      />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style>
/* Global styles are in style.css, but we ensure app takes full height */
#app {
  width: 100%;
}
</style>
