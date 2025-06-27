// hooks/use-socket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);

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
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current!,
    socketReady,
    socketId: socketRef.current?.id,
  };
}
