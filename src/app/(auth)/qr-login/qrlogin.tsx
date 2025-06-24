'use client';

import { useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import axios from 'axios';

function QRLoginPage() {
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');

  const generateQR = async () => {
    setError('');
    setQrUrl('');

    try {
      const res = await axios.post('/api/generate-qr-token');
      if (!res.data?.url) {
        throw new Error('QR URL not received');
      }

      setQrUrl(res.data.url);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to generate QR');
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Generate QR Login</Title>
        <Button onClick={generateQR}>Generate QR</Button>

        {error && <ErrorText>{error}</ErrorText>}

        {qrUrl && (
          <QRCodeWrapper>
            <QRCode value={qrUrl} size={200} />
            <SmallText>Scan this QR from your mobile to log in</SmallText>
          </QRCodeWrapper>
        )}
      </Card>
    </Wrapper>
  );
}

export default QRLoginPage;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
`;

const Card = styled.div`
  background: #1e1e1e;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const QRCodeWrapper = styled.div`
  margin-top: 20px;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
`;

const ErrorText = styled.p`
  color: #f55;
  font-size: 12px;
  margin-bottom: 8px;
`;
