import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);
  const { data: session } = useSession();

  // Initialize socket
  useEffect(() => {
    const socket = io(undefined, {
      path: '/api/socket_io',
    });

    socketRef.current = socket;
    socket.onAny((event, ...args) => {
      console.log('📡 SOCKET EVENT:', event, args);
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketReady(true);

      if (session?.user?._id) {
        socket.emit('register-user', session.user._id); // Register user globally
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?._id]);

  return { socket: socketRef.current, socketReady };
}
