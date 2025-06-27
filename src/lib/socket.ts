// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_APP_URL!, {
  path: '/api/socket_io',
  transports: ["websocket"],
});

export default socket;
