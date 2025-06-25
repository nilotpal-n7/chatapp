import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '@/store/hooks';
import { createChatroom, fetchChatrooms, setRoomId } from '@/store/chatroomSlice';
import { fetchMessages } from '@/store/messageSlice';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from '@/models/user';

function SearchPanel() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchText.length > 1) {
        const res = await axios.get<ApiResponse>('/api/search-users', {params: {searchText}})

        if(res.data) setResults(res.data.users || []);
        else setResults([])
        
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  const handleUserClick = async (user: User) => {
    try {
      console.log('hello')
      const room = await dispatch(createChatroom({userId: user._id.toString(), isGroup: false, name: 'Chatroom'})).unwrap()
      console.log('chatroom created')
      dispatch(setRoomId(room._id));
      console.log('roomId set')

      await dispatch(fetchChatrooms());
      console.log('chatrooms fetched')
      await dispatch(fetchMessages(room._id));
      console.log('messages fetched')

      setSearchText('');
      setResults([]);
      setIsFocused(false);
    } catch (error) {
      console.error('Failed to create or join chatroom:', error);
    }
  };

  return (
    <Wrapper>
      <Container>
        <SearchIcon src={'/search.svg'}/>
        <SearchInput
        ref={inputRef}
        onChange={e => setSearchText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        value={searchText}
        type='text'
        placeholder='Search'
        />
      </Container>

      {isFocused && results.length > 0 && (
        <ResultsBox>
          {results.map((user) => (
            <ResultRow key={user._id.toString()} onClick={() => handleUserClick(user)}>
              <Avatar src={'/profile-img.webp'} />
              <Info>
                <Name>{user.firstName + " " + user.lastName || 'Unnamed'}</Name>
                <Email>{user.email}</Email>
              </Info>
            </ResultRow>
          ))}
        </ResultsBox>
      )}
    </Wrapper>
  );
}

export default SearchPanel;

const Container = styled.div`
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

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ResultsBox = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  border-radius: 10px;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #333;

  &:hover {
    background-color: #2a2a2a;
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #f0f0f0;
`;

const Email = styled.span`
  font-size: 12px;
  color: #aaa;
`;
