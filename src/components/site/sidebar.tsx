'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaUsers, FaCalendarAlt, FaStar, FaCog, FaSignOutAlt, FaQrcode } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import QRScan from '@/components/site/qrScan';
import QRGenerator from './qrGen';
interface ButtonProps {
  active: boolean;
}

function Sidebar() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [active, setActive] = useState('scan');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleQR = () => {
    setShowQRModal(true);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setActive('scan')
      setShowQRModal(false);
    }
  };

  useEffect(() => {
    if (showQRModal) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showQRModal]);

  return (
    <Container>
      <Logo>NG</Logo>
      <Nav>
        <FaHome />
        <FaUsers />
        <FaCalendarAlt />
        <FaStar />
        <FaCog />
        <FaQrcode cursor='pointer' onClick={handleQR} />
        <FaSignOutAlt cursor='pointer' onClick={() => signOut()} />
      </Nav>

      {showQRModal && (
        <Backdrop>
          <ModalCard ref={modalRef}>
            <h3>QR Code Login</h3>
            <ButtonRow>
              <ScanButton
                active={active === 'scan'}
                title='Scan QR'
                type='button'
                onClick={() => {
                  setActive('scan')
                }}
              >
                Scan QR
              </ScanButton>

              <GenButton
                active={active === 'gen'}
                title='Generate QR'
                type='button'
                onClick={() => {
                  setActive('gen')
                }}
              >
                Generate QR
              </GenButton>
            </ButtonRow>

            <Divider />

            {active === 'gen' && <QRGenerator />}
            {active === 'scan' && <QRScan />}

          </ModalCard>
        </Backdrop>
      )}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: white;
`;

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  font-size: 18px;
  color: #888;
  align-items: center;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalCard = styled.div`
  background: #222;
  padding: 20px 24px;
  border-radius: 12px;
  color: white;
  width: 320px;
  text-align: center;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  height: 1px;
  background: #444;
`;
const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;
  background-color: #111;
  border-radius: 10px;
`
const ScanButton = styled.button<ButtonProps>`
  background-color: ${({active}) => active ? '#333' : ''};
  border-radius: 10px;
  height: 40px;
  width: 120px;
`
const GenButton = styled.button<ButtonProps>`
  background-color: ${({active}) => active ? '#333' : ''};
  border-radius: 10px;
  height: 40px;
  width: 120px;
`
