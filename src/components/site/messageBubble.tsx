import React from 'react';
import styled from 'styled-components';
import { FaRegEye } from 'react-icons/fa'; // For the eye icon

function MessageCard() {
  return (
    <Wrapper>
      <MessageBubble>
        <SenderName>Lili Wilson</SenderName>
        <MessageText>
          I&apos;m stuck in traffic, I&apos;ll be there a little laterjvfqwbfcqyugyunqgyx3ygyfqygxg4g4
        </MessageText>
        <BottomRow>
          <EmojiRow>
            <span>😥</span>
            <span>😷</span>
          </EmojiRow>
          <MetaData>
            <FaRegEye size={14} color="white" />
            <span>3</span>
            <span>09:01</span>
          </MetaData>
        </BottomRow>
      </MessageBubble>
      <Avatar src="profile-img.webp" />
    </Wrapper>
  );
}

export default MessageCard;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 10px 0;
  gap: 8px;
`;

const MessageBubble = styled.div`
  background-color: #5372f0;
  color: white;
  padding: 12px 16px;
  border-radius: 16px 16px 4px 16px;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 40%;         // Limit width to 60% of parent container
  word-wrap: break-word;  // Force word wrap if needed
  white-space: normal;    // Allow multiline text
  overflow-wrap: break-word;
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: bold;
  opacity: 0.9;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

const EmojiRow = styled.div`
  font-size: 18px;
  display: flex;
  background-color: black;
  border-radius: 20px;
`;

const MetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.8;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
`;
const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
`
