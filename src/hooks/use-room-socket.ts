// hooks/useRoomSocket.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export function useRoomSocket(socket: Socket | null, roomId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join-room', roomId);
    console.log(`📥 Joined room: ${roomId}`);

    const handleOnline = (users: string[]) => {
      setOnlineUsers(users);
    };

    socket.on('room-online-users', handleOnline);

    return () => {
      socket.off('room-online-users', handleOnline);
    };
  }, [socket, roomId]);

  return { onlineUsers };
}
