import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import MessageCard from './messageCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/use-socket';
import { addMessage } from '@/store/messageSlice';
import { updateLastMessage } from '@/store/chatroomSlice';
import { Message } from '@/models/message';

function ChatArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true)

  const roomId = useAppSelector((state) => state.chatroom.roomId);
  const {socket} = useSocket();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const messages = useAppSelector((state) => state.message.messages);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('join-room', roomId);

    const handleMessage = (message: Message) => {
      dispatch(updateLastMessage({ message }));

      if (message.roomId.toString() !== roomId) return;
      if (message.senderId.toString() !== session?.user?._id) {
        dispatch(addMessage(message));
      }
    };

    socket.on('receive-message', handleMessage);
    return () => {
      socket.off('receive-message', handleMessage)
    }
  }, [socket, roomId, session?.user?._id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const current = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;

      setScrollDir(current > scrollTop ? 'down' : 'up');
      setScrollTop(current);

      const buffer = 80;
      setIsAtBottom(current >= maxScroll - buffer);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollTop]);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Scroll to bottom on open
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Auto-scroll if already at bottom when new message arrives
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages.length]);

  return (
    <Container ref={containerRef}>
      {messages.map((msg) => (
        <MessageCard
          key={msg._id.toString()}
          mine={msg.senderId.toString() === session?.user._id}
          scrollDir={scrollDir}
          text={msg.message}
        />
      ))}
    </Container>
  );
}

export default ChatArea;

const Container = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  scrollbar-width: thin;
  scrollbar-color: #5c5c5c transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #5c5c5c;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }
`;
