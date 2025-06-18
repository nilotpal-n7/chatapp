import React from 'react'
import styled from 'styled-components'
import { FaHome, FaUsers, FaCalendarAlt, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { signOut } from 'next-auth/react'

function Sidebar() {
  return (
    <Container>
      <Logo>NG</Logo>
      <Nav>
        <FaHome />
        <FaUsers />
        <FaCalendarAlt />
        <FaStar />
        <FaCog />
        <FaSignOutAlt cursor={'pointer'} onClick={() => signOut()}/>
      </Nav>
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`

const Logo = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: white;
`

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  font-size: 18px;
  color: #888;
  align-items: center;
`
