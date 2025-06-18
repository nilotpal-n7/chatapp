'use client'

import ChatList from '@/components/site/chatList'
import ChatWindow from '@/components/site/chatWindow'
import Sidebar from '@/components/site/sidebar'
import styled from 'styled-components'

function Dashboard() {
  return (
    <Container>
      <LeftPanel>
        <Sidebar />
      </LeftPanel>

      <RightPanel>
        <InnerLeft>
          <SearchPanel>
            <SearchIcon src={'search.svg'}/>
            <SearchInput type='text' placeholder='Search'/>
          </SearchPanel>
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
const SearchPanel = styled.div`
  background-color: #2e333d;
  height: 50px;
  width: 100%;
  border-radius: 20px;
  margin: 30px 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
`
const SearchIcon = styled.img`
  height: 30px;
  width: 30px;
`
const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  all: unset;
  margin-left: 10px;
  color: rgb(175, 175, 175);
  font-weight: 500;
  white-space: nowrap;         // Prevent text wrapping
  overflow: hidden;            // Hide overflow text
  text-overflow: ellipsis;     // Show ... when text overflows
  min-width: 0;
`
