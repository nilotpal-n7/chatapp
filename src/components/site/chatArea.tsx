import React from 'react'
import styled from 'styled-components'
import MessageCard from './messageBubble'

function ChatArea() {
  return (
    <Container>
        <MessageCard />
    </Container>
  )
}

export default ChatArea

const Container = styled.div`
    flex: 1;
`
