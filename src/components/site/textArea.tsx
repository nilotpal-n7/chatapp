import React from 'react'
import styled from 'styled-components'

function TextArea() {
  return (
    <Container>
      <SearchIcon src={'search.svg'}/>
      <SearchInput type='text' placeholder='Search'/>
    </Container>
  )
}

export default TextArea

const Container = styled.div`
  background-color: #2e333d;
  height: 40px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
`
const SearchIcon = styled.img`
  height: 20px;
  width: 20px;
  flex-shrink: 0;
`
const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  margin-left: 10px;
  color: rgb(175, 175, 175);
  font-weight: 500;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: rgb(175, 175, 175);
    opacity: 0.6;
  }
`
