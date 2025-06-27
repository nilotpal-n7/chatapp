'use client'

import ChatList from '@/components/site/chatList'
import ChatWindow from '@/components/site/chatWindow'
import SearchPanel from '@/components/site/searchPanel'
import Sidebar from '@/components/site/sidebar'
import { PlainMessage } from '@/helpers/plain-message'
import { useSocket } from '@/hooks/use-socket'
import { fetchChatrooms, updateLastMessage } from '@/store/chatroomSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import styled from 'styled-components'

function Dashboard() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { socket } = useSocket();

  useEffect(() => {
    async function fetch() {
      if (session?.user._id) {
        await dispatch(fetchChatrooms());
      }
    }
  
    fetch()
  }, [session]);

  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  useEffect(() => {
    if (!socket || !session?.user?._id || !chatrooms.length) return;

    // ✅ 1. Register user after connect
    socket.emit('register-user', session.user._id);
    console.log('✅ Registered user:', session.user._id);

    // ✅ 2. Join rooms after registration
    chatrooms.forEach((room) => {
      socket.emit('join-room', room._id);
      console.log('📥 Joined room:', room._id);
    });
  }, [socket, session?.user._id, chatrooms]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: PlainMessage) => {
      console.log('📩 Global receive-message:', message);
      dispatch(updateLastMessage({ message }));
    };

    socket.on('receive-message', handleMessage);
    return () => {
      socket.off('receive-message', handleMessage)
    };
  }, [socket]);

  return (
    <Container>
      <LeftPanel>
        <Sidebar />
      </LeftPanel>

      <RightPanel>
        <InnerLeft>
          <SearchPanel />
          <ChatList />
        </InnerLeft>

        <InnerRight>
          <ChatWindow />
        </InnerRight>
      </RightPanel>
    </Container>
  )
}

export default Dashboard

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  min-height: 500px;

  background-color: #131313;
  display: flex;
  overflow-y: hidden;

  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #5c5c5c transparent; /* Firefox */

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
`
const LeftPanel = styled.div`
  height: 100%;
  width: 70px;
  
`
const RightPanel = styled.div`
  background-color: #202329;
  height: 100%;
  flex: 1;
  border-radius: 30px 0px 0px 30px;
  display: flex;
  gap: 20px;
`
const InnerLeft = styled.div`
  height: 100%;
`
const InnerRight = styled.div`
  height: 100%;
  flex: 1;
  padding: 30px;
  padding-bottom: 10px;
`
