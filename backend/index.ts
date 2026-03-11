import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const PORT = process.env.PORT || 4000;

// Simple history to share with new clients (optional but good practice)
let messageHistory: Message[] = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send history to the new user
  socket.emit('history', messageHistory);

  socket.on('join', (username: string) => {
    console.log(`${username} joined the chat`);
    socket.data.username = username;
    io.emit('notification', `${username} joined the chat`);
  });

  socket.on('message', (data: { user: string; text: string }) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      user: data.user,
      text: data.text,
      timestamp: new Date().toLocaleTimeString()
    };
    
    messageHistory.push(newMessage);
    if (messageHistory.length > 50) messageHistory.shift();

    io.emit('message', newMessage);
  });

  socket.on('typing', (username: string) => {
    socket.broadcast.emit('user_typing', username);
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('user_stop_typing', socket.data.username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.data.username) {
      io.emit('notification', `${socket.data.username} left the chat`);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
