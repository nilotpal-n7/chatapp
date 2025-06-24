'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export const SocketProvider = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const socket = io(undefined, {
      path: '/api/socket_io',
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setReady(true);
      if (session?.user?._id) {
        socket.emit('register-user', session.user._id);
        console.log('✅ Registered:', session.user._id);
      }
    });

    return () => socket.disconnect();
  }, [session?.user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
