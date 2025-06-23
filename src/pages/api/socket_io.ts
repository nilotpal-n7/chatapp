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

      socket.on('join-room', (roomId) => {
        socket.join(roomId);

        // Send all online users in this room
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const users = socketsInRoom
          .map(id => onlineUsers.get(id))
          .filter(Boolean);
          
        io.to(roomId).emit('room-online-users', users); // ✅ push list
        console.log(`📥 Joined room: ${roomId}`);
      });

      socket.on('send-message', ({ roomId, message }) => {
        console.log(`📨 Message in ${roomId}:`, message);
        socket.to(roomId).emit('receive-message', message);
      });

      socket.on('register-user', (userId) => {
        onlineUsers.set(socket.id, userId);
        console.log('✅ user online:', userId);
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
