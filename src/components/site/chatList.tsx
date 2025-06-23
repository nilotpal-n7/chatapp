import React, { useState } from 'react'
import ProfileCard from './profileCard'
import { fetchMessages } from '@/store/messageSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRoomId } from '@/store/chatroomSlice'
import { getChatroomDisplayName } from '@/lib/utils'
import { useSession } from 'next-auth/react'

function ChatList() {
  const dispatch = useAppDispatch()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const {data: session} = useSession()
  const currentUserId = session?.user._id;

  const onClick = (roomId: string) => {
    setSelectedRoom(roomId)
    dispatch(setRoomId(roomId))
    dispatch(fetchMessages(roomId))
  }

  return (
    <>
        {Array.isArray(chatrooms) && chatrooms.map((room) => (
          <ProfileCard
            key={room._id}
            name={getChatroomDisplayName(room, currentUserId)}
            imgSrc='profile-img.webp'
            selected={selectedRoom === room._id}
            onClick={() => onClick(room._id)}
            message={room.lastMessage?.message}
            time='2:30'
            unreadCount={5}
            isStarred={true}
            isRead={false}
          />
        ))}
    </>
  )
}

export default ChatList
