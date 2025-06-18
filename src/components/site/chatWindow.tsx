import React from 'react'
import styled from 'styled-components'
import ChatArea from './chatArea'
import TextArea from './textArea'

function ChatWindow() {
  return (
    <Container>
        <TopRow>
            <LeftRow>
                <Name>Office Chat</Name>
                <Details>
                    45 members, 24 online
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
