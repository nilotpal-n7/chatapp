import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaRegEye } from 'react-icons/fa';
import { motion, useAnimation, useInView } from 'framer-motion';

function MessageCard({
  mine,
  scrollDir,
  text,
  
}: {mine: boolean, scrollDir: string, text: string}) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    margin: '0px 0px -50px 0px', // key: watch element exiting the top
    //triggerOnce: false,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
      });
    } else {
      // this happens when message exits view upward or downward
      if (scrollDir === 'up') {
        controls.start({
          opacity: 0,
          y: -40,
          transition: { duration: 0.25 },
        });
      } else if (scrollDir === 'down') {
        controls.start({
          opacity: 0,
          x: mine ? 60 : -60,
          transition: { duration: 0.25 },
        });
      }
    }
  }, [inView, scrollDir]);

  return (
    <Wrapper mine={mine}>
      {!mine && <Avatar src="/profile-img.webp" />}
      <AnimatedBubble ref={ref} mine={mine} animate={controls} initial={false}>
        <SenderName>{mine ? 'You' : 'Lili Wilson'}</SenderName>

        <MessageText>
          {text}
        </MessageText>

        <BottomRow>
          <EmojiRow>
            <span>😏</span>
            <span>🥳</span>
          </EmojiRow>
          <MetaData>
            <FaRegEye size={14} />
            <span>3</span>
            <span>09:01</span>
          </MetaData>
        </BottomRow>
      </AnimatedBubble>
      {mine && <Avatar src="/profile-img.webp" />}
    </Wrapper>
  );
}

export default MessageCard;

// Styling

const Wrapper = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${({ mine }) => (mine ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  margin: 10px 20px;
  gap: 10px;
`;

const AnimatedBubble = styled(motion.div)<{ mine: boolean }>`
  background-color: ${({ mine }) => (mine ? '#6b8afd' : '#2e333d')};
  color: white;
  padding: 12px 16px;
  border-radius: ${({ mine }) =>
    mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  max-width: 40%;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: bold;
  opacity: 0.85;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const EmojiRow = styled.div`
  font-size: 18px;
  display: flex;
  gap: 6px;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
`;

const MetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.75;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
`;
