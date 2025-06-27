import { Server as ServerIO } from 'socket.io';
import { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & { io?: ServerIO };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('🔌 Initializing Socket.io server...');

    const io = new ServerIO(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    res.socket.server.io = io;
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
      console.log('⚡ Socket connected:', socket.id);

      // ==== ✅ QR LOGIN FLOW ====

      socket.on('create-qr-session', (sessionId) => {
        socket.join(sessionId);
        console.log(`🔐 QR session created: ${sessionId}`);
      });

      socket.on('approve-qr-session', ({ sessionId }) => {
        const clientSocketId = socket.id;

        if (!io.sockets.adapter.rooms.has(sessionId)) {
          socket.emit('qr-error', { message: 'QR session not found.' });
          return;
        }

        console.log(`📤 Approval requested for: ${sessionId} by ${clientSocketId}`);
        io.to(sessionId).emit('qr-approval-request', { clientSocketId });
      });

      socket.on('grant-qr-login', ({ clientSocketId, userId, tokenId }) => {
        console.log(`✅ Granting login to ${clientSocketId}`);
        io.to(clientSocketId).emit('qr-login-success', { userId, tokenId });
      });

      // ==== 💬 Chat Rooms ====

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const users = socketsInRoom.map(id => onlineUsers.get(id)).filter(Boolean);
        io.to(roomId).emit('room-online-users', users);
        console.log(`📥 Joined room: ${roomId}`);
      });

      socket.on('send-message', ({ roomId, message }) => {
        console.log(`📨 Message in ${roomId}:`, message);
        socket.to(roomId).emit('receive-message', message);
      });

      socket.on('register-user', (userId) => {
        onlineUsers.set(socket.id, userId);
        console.log('✅ User online:', userId);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.id);
        onlineUsers.delete(socket.id);
      });
    });
  } else {
    console.log('✅ Socket.io already initialized.');
  }

  res.end();
}
