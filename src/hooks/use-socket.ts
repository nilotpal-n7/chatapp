import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppDispatch } from '@/store/hooks';
import { addMessage } from '@/store/messageSlice';
import { useSession } from 'next-auth/react';

let socket: Socket;

export function useSocket() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    socket = io({ path: '/api/socket_io' });

    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO');

      // ✅ Join this user's private room
      if (session?.user?._id) {
        socket.emit('join-room', session.user._id);
      }
    });

    socket.on('new-message', (msg) => {
      if (msg.senderId !== session?.user._id) {
        dispatch(addMessage(msg));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?._id]);

  const sendMessageSocket = (msg: any) => {
    socket.emit('send-message', msg); // msg must contain receiverId
  };

  return { sendMessageSocket };
}
