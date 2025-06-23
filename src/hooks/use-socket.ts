import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useSocket(roomId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data: session } = useSession();

  // Initialize socket
  useEffect(() => {
    const socket = io(undefined, {
      path: '/api/socket_io',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketReady(true);

      if (session?.user?._id) {
        socket.emit('register-user', session.user._id); // Register user globally
      }
    });

    socket.on('room-online-users', (users: string[]) => {
      setOnlineUsers(users); // Track online users in current room
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?._id]);

  // Join chatroom
  useEffect(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('join-room', roomId);
      console.log(`📥 Joined room: ${roomId}`);
    }
  }, [roomId]);

  return { socket: socketRef.current, onlineUsers };
}
