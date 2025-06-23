'use client'

import ChatList from '@/components/site/chatList'
import ChatWindow from '@/components/site/chatWindow'
import SearchPanel from '@/components/site/searchPanel'
import Sidebar from '@/components/site/sidebar'
import { fetchChatrooms } from '@/store/chatroomSlice'
import { useAppDispatch } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import styled from 'styled-components'

function Dashboard() {
  useEffect(() => {
    fetch('/api/socket');
  }, []);

  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user._id) {
      dispatch(fetchChatrooms(session.user._id));
    }
  }, [session]);

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
  flex: 1;
`
const InnerRight = styled.div`
  height: 100%;
  flex: 3;
  padding: 30px;
  padding-bottom: 10px;
`
