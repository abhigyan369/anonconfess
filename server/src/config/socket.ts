import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Socket } from 'socket.io';

let io: SocketServer;

export const initSocket = (server: HTTPServer): SocketServer => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join-confession', (confessionId: string) => {
      socket.join(confessionId);
      console.log(`Socket ${socket.id} joined room: ${confessionId}`);
    });

    socket.on('leave-confession', (confessionId: string) => {
      socket.leave(confessionId);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
