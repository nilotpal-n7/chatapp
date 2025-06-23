import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import MessageCard from './messageCard';
import { useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';

function ChatArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down');
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true)

  const { data: session } = useSession();
  const messages = useAppSelector((state) => state.message.messages);

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
          key={msg.id}
          mine={msg.senderId === session?.user?._id}
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
