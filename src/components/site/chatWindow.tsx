import React from 'react'
import styled from 'styled-components'
import ChatArea from './chatArea'
import TextArea from './textArea'
import { useAppSelector } from '@/store/hooks';
import { getChatroomDisplayName } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/use-socket';
import { useRoomSocket } from '@/hooks/use-room-socket';

function ChatWindow() {
    const roomId = useAppSelector(state => state.chatroom.roomId);
    const chatrooms = useAppSelector(state => state.chatroom.chatrooms);
    const currentRoom = chatrooms.find(room => room._id.toString() === roomId);
    const {socket} = useSocket()
    const { onlineUsers } = useRoomSocket(socket, roomId);
    const {data: session} = useSession()
    const onlineCount = currentRoom?.participants.filter(p =>
        onlineUsers.includes(p._id.toString())
    ).length;

  return (
    <Container>
        <TopRow>
            <LeftRow>
                <Name>
                  {currentRoom?.isGroup
                    ? currentRoom.name
                    : session?.user?._id && currentRoom
                      ? getChatroomDisplayName(currentRoom, session.user._id)
                      : 'Loading...'}
                </Name>

                <Details>
                    {currentRoom?.participants.length} members, {onlineCount} online
                </Details>
            </LeftRow>

            <RightRow>
                <Icon src='search.svg' />
                <Icon src='call.svg' />
                <Icon src='toggle.svg' />
                <Icon src='menu.svg' />
            </RightRow>
        </TopRow>
        <ChatArea />
        <TextArea />
    </Container>
  )
}

export default ChatWindow

const Container = styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 500px;
`
const TopRow = styled.div`
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
`
const LeftRow = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const RightRow = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Name = styled.div`
    color: #fff;
    font-weight: 500;
`
const Details = styled.div`
    color: #aaa;
    display: flex;
`
const Icon = styled.img`
    height: 20px;
    width: 20px;
`
