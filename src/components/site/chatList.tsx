import React from 'react'
import ProfileCard from './profileCard'
import { fetchMessages } from '@/store/messageSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRoomId } from '@/store/chatroomSlice'
import { getChatroomDisplayName } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import styled from 'styled-components'

function ChatList() {
  const dispatch = useAppDispatch()
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const {data: session} = useSession()
  const currentUserId = session?.user._id;
  const roomId = useAppSelector((state) => state.chatroom.roomId);

  const onClick = (roomId: string) => {
    dispatch(setRoomId(roomId))
    dispatch(fetchMessages(roomId))
  }

  return (
    <Container>
        {Array.isArray(chatrooms) && chatrooms.map((room) => (
          <ProfileCard
            key={room._id}
            name={getChatroomDisplayName(room, currentUserId)}
            imgSrc='profile-img.webp'
            selected={roomId === room._id}
            onClick={() => onClick(room._id)}
            message={room.lastMessage?.message}
            time='2:30'
            unreadCount={5}
            isStarred={true}
            isRead={false}
          />
        ))}
    </Container>
  )
}

export default ChatList

const Container = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;

  
  overflow-x: hidden;
  overflow-y: auto;

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