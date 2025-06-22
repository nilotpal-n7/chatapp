import { Server } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { NextApiResponseWithSocket } from '@/types/NextApiWithSocket';

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('✅ Socket.IO already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket_io',
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join the user’s own room using their userId (provided by the client)
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`🟢 Joined room ${roomId}`);
    });

    socket.on('send-message', (msg) => {
      const { receiverId } = msg;
      socket.to(receiverId).emit('new-message', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  console.log('🚀 Socket.IO initialized');
  res.end();
}
