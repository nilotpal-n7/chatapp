import { useSocket } from '@/hooks/use-socket';
import { updateLastMessage } from '@/store/chatroomSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendMessage } from '@/store/messageSlice';
import React, { useState } from 'react'
import { toast } from 'sonner';
import styled from 'styled-components'

function TextArea() {
  const [message, setMessage] = useState('');
  const roomId = useAppSelector((state) => state.chatroom.roomId);
  const dispatch = useAppDispatch();
  const {socket} = useSocket(roomId);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomId) {
      toast.error("No user selected");
      return;
    }

    if (!message.trim()) {
      toast.error("Cannot send an empty message");
      return;
    }

    try {
      const savedMessage = await dispatch(sendMessage({ roomId, message })).unwrap();
      dispatch(updateLastMessage({ roomId, message: savedMessage }));

      socket?.emit('send-message', {
        roomId,
        message: savedMessage,
      });

      toast.success('Success', {
        description: 'Message sent successfully',
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message', error);
      toast.error('Error', {
        description: 'Error sending message',
      });
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <SearchIcon src={'send.svg'} />
      <SearchInput
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        value={message}
        placeholder="Type a message"
      />
    </FormContainer>
  );
}

export default TextArea;

const FormContainer = styled.form`
  background-color: #2e333d;
  height: 40px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
`
const SearchIcon = styled.img`
  height: 20px;
  width: 20px;
  flex-shrink: 0;
`
const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  margin-left: 10px;
  color: rgb(175, 175, 175);
  font-weight: 500;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: rgb(175, 175, 175);
    opacity: 0.6;
  }
`
