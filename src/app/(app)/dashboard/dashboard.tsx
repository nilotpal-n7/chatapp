'use client'

import { signOut } from 'next-auth/react'
import React from 'react'
import styled from 'styled-components'

function Dashboard() {
  return (
    <Container>
      Dashboard
      <button type='button' onClick={e => {
        e.preventDefault()
        signOut()
      }}>
        Sign Out
      </button>
    </Container>
  )
}

export default Dashboard

const Container = styled.div`

`
