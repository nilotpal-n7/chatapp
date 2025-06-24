import React from 'react'
import styled from 'styled-components'

interface ContainerProps {
  selected: boolean;
}
interface MessageProps {
  isRead: boolean;
}

function ProfileCard({
  imgSrc,
  name,
  message,
  time,
  unreadCount,
  isStarred,
  isRead,
  selected,
  onClick,
}: {imgSrc: string, name: string, message: string | undefined, time: string, unreadCount: number, isStarred: boolean, isRead: boolean, selected: boolean, onClick: () => void}) {
  return (
    <Container onClick={onClick} selected={selected}>
      <ProfileImg src={imgSrc} />
      <ProfileInfo>
        <TopRow>
          <Name>{name}</Name>
          <Time>{time}</Time>
        </TopRow>
        <BottomRow>
          <Message isRead={isRead}>{message}</Message>
          <Icons>
            {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
            {isStarred && <StarIcon>★</StarIcon>}
          </Icons>
        </BottomRow>
      </ProfileInfo>
    </Container>
  )
}

export default ProfileCard

const Container = styled.div<ContainerProps>`
  background-color: ${({ selected }) => (selected ? '#2e333d' : '')};
  height: 70px;
  width: 100%;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ selected }) =>
      selected ? '' : '#2e333d'};
    cursor: pointer;
  }
`

const ProfileImg = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 16px;
  margin-right: 10px;
`

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`

const Name = styled.div`
  color: white;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Time = styled.div`
  color: gray;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
`

const Message = styled.div<MessageProps>`
  color: ${({ isRead }) => (isRead ? '#aaa' : 'white')};
  font-size: 14px;
  font-weight: ${({ isRead }) => (isRead ? 400 : 600)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`

const StarIcon = styled.div`
  font-size: 16px;
  color: #f2cc0f;
`

const UnreadBadge = styled.div`
  background-color: #6b8afd;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
  box-sizing: border-box;
  white-space: nowrap;
`
