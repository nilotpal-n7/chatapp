import React, { useState } from 'react'
import ProfileCard from './profileCard'
import { fetchMessages, setId } from '@/store/messageSlice'
import { useAppDispatch } from '@/store/hooks'

function ChatList() {
  const dispatch = useAppDispatch()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const onClick = (userId: string) => {
    setSelectedUser(userId)
    dispatch(setId(userId))
    dispatch(fetchMessages(userId))
  }

  const users = [
    {
      id: '6858283a3bf38fca0a7ae84a',
      name: 'Pallu',
      imgSrc: 'profile-img.webp',
      message: 'I want to ask you to pick ...',
      time: '9:52 am',
      unreadCount: 5,
      isStarred: true,
      isRead: false,
    },
    {
      id: '685827ea3bf38fca0a7ae83b',
      name: 'Nilot',
      imgSrc: 'profile-img.webp',
      message: 'I want to ask you to pick ...',
      time: '9:52 am',
      unreadCount: 5,
      isStarred: true,
      isRead: false,
    },
  ]

  return (
    <>
        {users.map((user) => (
            <ProfileCard
                key={user.id}
                {...user}
                selected={selectedUser === user.id}
                onClick={() => onClick(user.id)}
            />
        ))}
    </>
  )
}

export default ChatList
