import React, { useState } from 'react'
import ProfileCard from './profileCard'

function ChatList() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const users = [
    {
      id: 1,
      name: 'Jenny Li',
      imgSrc: 'profile-img.webp',
      message: 'I want to ask you to pick ...',
      time: '9:52 am',
      unreadCount: 5,
      isStarred: true,
      isRead: false,
    },
    {
      id: 2,
      name: 'Harry Fettel',
      imgSrc: 'profile-img.webp',
      message: 'Our company needs to prepare',
      time: '15 m',
      unreadCount: 0,
      isStarred: false,
      isRead: true,
    },
    {
      id: 3,
      name: 'Harry Fettel',
      imgSrc: 'profile-img.webp',
      message: 'Our company needs to prepare',
      time: '15 m',
      unreadCount: 1,
      isStarred: false,
      isRead: true,
    },
    // more users...
  ]

  return (
    <>
        {users.map((user) => (
            <ProfileCard
                key={user.id}
                {...user}
                selected={selectedUser === user.id}
                onClick={() => setSelectedUser(user.id)}
            />
        ))}
    </>
  )
}

export default ChatList
