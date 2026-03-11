import { io as Client, Socket } from 'socket.io-client';
import { httpServer, io } from './index';
import { AddressInfo } from 'net';

describe('Chat Integration Tests', () => {
  let client1: Socket;
  let client2: Socket;
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
    client1 = Client(`http://localhost:${port}`);
    client2 = Client(`http://localhost:${port}`);
    
    let count = 0;
    const check = () => {
      count++;
      if (count === 2) done();
    };
    
    client1.on('connect', check);
    client2.on('connect', check);
  });

  afterEach(() => {
    client1.disconnect();
    client2.disconnect();
  });

  it('should broadcast messages from client1 to client2', (done) => {
    const msgData = { user: 'Alice', text: 'Integration Test' };
    
    client2.on('message', (received) => {
      expect(received.user).toBe('Alice');
      expect(received.text).toBe('Integration Test');
      done();
    });

    client1.emit('message', msgData);
  });

  it('should notify all clients when a new user joins', (done) => {
    client2.on('notification', (note) => {
      expect(note).toContain('Charlie joined');
      done();
    });

    client1.emit('join', 'Charlie');
  });
});
