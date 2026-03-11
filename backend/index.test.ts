import { io as Client, Socket } from 'socket.io-client';
import { httpServer, io } from './index';
import request from 'supertest';
import { AddressInfo } from 'net';

describe('Chat Backend Tests', () => {
  let clientSocket: Socket;
  let port: number;

  beforeAll((done) => {
    httpServer.listen(() => {
      port = (httpServer.address() as AddressInfo).port;
      done();
    });
  });

  afterAll((done) => {
    io.close();
    httpServer.close();
    done();
  });

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${port}`);
    clientSocket.on('connect', done);
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  test('HTTP root endpoint should return server status', async () => {
    const response = await request(httpServer).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Chat server is running');
  });

  test('Should communicate a message correctly', (done) => {
    const testMessage = { user: 'TestUser', text: 'Hello World' };
    
    clientSocket.on('message', (msg) => {
      expect(msg.user).toBe(testMessage.user);
      expect(msg.text).toBe(testMessage.text);
      expect(msg).toHaveProperty('id');
      expect(msg).toHaveProperty('timestamp');
      done();
    });

    clientSocket.emit('message', testMessage);
  });

  test('Should notify when a user joins', (done) => {
    const username = 'Alice';
    
    clientSocket.on('notification', (msg) => {
      expect(msg).toBe(`${username} joined the chat`);
      done();
    });

    clientSocket.emit('join', username);
  });

  test('Should broadcast typing status', (done) => {
    const username = 'Bob';
    const otherClient = Client(`http://localhost:${port}`);
    
    otherClient.on('connect', () => {
      otherClient.on('user_typing', (typingUser) => {
        expect(typingUser).toBe(username);
        otherClient.disconnect();
        done();
      });

      clientSocket.emit('typing', username);
    });
  });
});
