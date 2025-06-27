import { Server as ServerIO } from 'socket.io';
import { Server as HTTPServer, IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import cookie from "cookie";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & { io?: ServerIO };
  };
};

const sessionToSocketMap = new Map(); // sessionId → socketId

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
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
    const onlineUsers = new Map<string, string>(); // socketId → userId

    io.on('connection', async (socket) => {
      console.log('⚡ Socket connected:', socket.id);
      // Parse cookies
      const rawCookie = req.headers.cookie || '';
      const cookies = cookie.parse(rawCookie);

      // ✅ Get the logged-in user (if any)
      const token = await getToken({
        req: {
          headers: req.headers,
          cookies: cookies as Partial<Record<string, string>>,
        } as IncomingMessage & { cookies: Partial<Record<string, string>> },
        secret: process.env.NEXTAUTH_SECRET,
      });

      const userId = token?._id;
      if (userId) {
        onlineUsers.set(socket.id, userId);
        console.log('✅ Authenticated user:', userId);
      }

      // ==== ✅ QR LOGIN FLOW ====

      socket.on('create-qr-session', (sessionId) => {
        socket.join(sessionId);
        sessionToSocketMap.set(sessionId, socket.id);
        console.log(`🔐 QR session created: ${sessionId} → ${socket.id}`);
      });

      socket.on('approve-qr-session', ({ sessionId }) => {
        const qrSocketId = sessionToSocketMap.get(sessionId);
        if (!qrSocketId) {
          socket.emit('qr-error', { message: 'QR session not found.' });
          return;
        }

        console.log(`📤 Approval requested for: ${sessionId} by ${socket.id}`);
        io.to(socket.id).emit('qr-approval-request', { clientSocketId: qrSocketId });
      });

      socket.on('grant-qr-login', ({ clientSocketId, tokenId }) => {
        const grantingUserId = onlineUsers.get(socket.id);
        if (!grantingUserId) {
          console.warn('❌ No userId found for granting socket.');
          return;
        }

        console.log(`✅ Granting login to ${clientSocketId} from ${grantingUserId}`);
        io.to(clientSocketId).emit('qr-login-success', {
          userId: grantingUserId,
          tokenId,
        });
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

      // Legacy support if needed
      socket.on('register-user', (manualUserId: string) => {
        onlineUsers.set(socket.id, manualUserId);
        console.log('🌐 Current online users:', Array.from(onlineUsers.entries()));
        console.log('✅ Manually registered user:', manualUserId);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.id);
        onlineUsers.delete(socket.id);

        for (const [sessionId, sockId] of sessionToSocketMap.entries()) {
          if (sockId === socket.id) {
            sessionToSocketMap.delete(sessionId);
          }
        }
      });
    });
  } else {
    console.log('✅ Socket.io already initialized.');
  }

  res.end();
}
