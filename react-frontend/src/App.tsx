import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from './store/useChatStore';
import { useSocket } from './hooks/useSocket';

function App() {
  const { username, setUsername, messages, isConnected, typingUsers } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const [tempName, setTempName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  
  const { sendMessage, sendTypingStatus } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Typing logic
    sendTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  if (!username) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>🚀 React Chat</h1>
          <p>Enter your name to join the workspace</p>
          <input 
            type="text" 
            placeholder="Username..." 
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            autoFocus
          />
          <button type="submit" style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}>
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>React Chat</span>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Logged as: {username}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={`status-dot ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>
      
      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-item ${msg.user === username ? 'message-own' : 'message-other'}`}>
            {msg.user !== username && <div className="message-user">{msg.user}</div>}
            <div className="message-text">{msg.text}</div>
            <div className="message-time">{msg.timestamp}</div>
          </div>
        ))}
        {Array.from(typingUsers).map((user) => (
          <div key={user} className="message-item message-other typing-indicator">
            <div className="message-user">{user} is typing...</div>
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
