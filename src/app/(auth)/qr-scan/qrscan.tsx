'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { signIn } from 'next-auth/react';

function ScanQRPage() {
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('scan-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveToHistory = (data: string) => {
    const newHistory = [data, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('scan-history', JSON.stringify(newHistory));
  };

  const verifyDecodedText = async (qrText: string) => {
    try {
      const fullUrl = new URL(qrText, window.location.origin);

      if (!fullUrl.pathname.includes('/api/auth/callback/credentials')) {
        setErrorText('⚠️ Invalid QR code.');
        return;
      }

      const tokenId = fullUrl.searchParams.get('tokenId');
      const userId = fullUrl.searchParams.get('userId');

      if (!tokenId || !userId) {
        setErrorText('⚠️ Missing token or userId in QR.');
        return;
      }

      setLoading(true);

      const { data } = await axios.post('/api/verify-qr-token', { tokenId });

      if (!data.success) {
        setErrorText(data.message || 'QR login failed.');
        return;
      }

      saveToHistory(qrText);

      const result = await signIn('credentials', {
        userId,
        tokenId,
        redirect: true,
        callbackUrl: '/dashboard',
      });

      if (result?.error) setErrorText(result.error);
    } catch (err) {
      console.error(err);
      setErrorText('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLiveScan = async (results: IDetectedBarcode[]) => {
    if (!results.length) return;
    const url = results[0].rawValue;
    console.log('✅ Live scan:', url);
    await verifyDecodedText(url);
  };

    const handleCapture = async () => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (!video || video.readyState < 2) {
        setErrorText('📷 Camera not active or permission denied.');
        return;
      }

      setLoading(true);
      setErrorText('');

      try {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Let frame stabilize

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorText('⚠️ Canvas drawing failed.');
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        document.body.appendChild(canvas);
        const base64Image = canvas.toDataURL('image/png');

        const { data } = await axios.post('/api/decode-qr', { image: base64Image });

        if (data.success) {
          console.log('✅ Snapshot decoded:', data.data);
          await verifyDecodedText(data.data);
        } else {
          console.warn('❌ Server responded:', data);
          setErrorText(data.message || 'No QR code found in snapshot.');
        }
      } catch (err) {
        console.error('❌ Snapshot error:', err);
        setErrorText('Snapshot capture failed.');
      } finally {
        setLoading(false);
      }
    };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const { data } = await axios.post('/api/decode-qr', formData);
      if (data.success) {
        console.log('✅ Upload decoded:', data.data);
        await verifyDecodedText(data.data);
      } else {
        setErrorText(data.message || 'No QR code found in uploaded image.');
      }
    } catch (err) {
      console.error(err);
      setErrorText('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleScannerError = (error: unknown) => {
    console.error('❌ Scanner error:', error);
    setPermissionError(true);
    setErrorText('Camera access error. Please allow permissions.');
  };

  return (
    <Wrapper>
      <Card>
        <Title>Scan or Upload QR Code</Title>

        {permissionError && (
          <Modal>
            <p>Camera permission is required to scan QR codes.</p>
            <CloseButton onClick={() => setPermissionError(false)}>OK</CloseButton>
          </Modal>
        )}

        <ScannerWrapper>
          <Scanner
            onScan={handleLiveScan}
            onError={handleScannerError}
            constraints={{ facingMode: 'environment' }}
          />
        </ScannerWrapper>

        <Button onClick={handleCapture}>📸 Capture Snapshot</Button>
        <Button onClick={() => fileInputRef.current?.click()}>📂 Upload Image</Button>
        <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" hidden />

        {loading && <Loading>⏳ Decoding...</Loading>}
        {errorText && <ErrorText>{errorText}</ErrorText>}
        <HintText>Scan or upload a valid QR code to log in</HintText>

        {history.length > 0 && (
          <History>
            <h4>Scan History:</h4>
            <ul>
              {history.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </History>
        )}
      </Card>
    </Wrapper>
  );
}

export default ScanQRPage;

const Wrapper = styled.div`
  height: 100vh;
  background: #111;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: #1e1e1e;
  padding: 24px;
  border-radius: 12px;
  color: white;
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 16px;
`;

const ScannerWrapper = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100%;
`;

const Loading = styled.p`
  color: #3b82f6;
  font-size: 13px;
  margin-bottom: 8px;
`;

const ErrorText = styled.p`
  color: #f55;
  font-size: 12px;
  margin-bottom: 8px;
`;

const HintText = styled.p`
  color: #aaa;
  font-size: 13px;
  margin-top: 12px;
`;

const Modal = styled.div`
  background: #222;
  padding: 16px;
  border-radius: 8px;
  position: absolute;
  z-index: 10;
  color: white;
  top: 20%;
  text-align: center;
`;

const CloseButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-top: 10px;
  border-radius: 4px;
`;

const History = styled.div`
  margin-top: 16px;
  width: 100%;
  h4 {
    font-size: 14px;
    margin-bottom: 4px;
  }
  ul {
    font-size: 12px;
    max-height: 100px;
    overflow-y: auto;
    list-style: none;
    padding-left: 0;
  }
  li {
    margin-bottom: 4px;
    word-break: break-word;
  }
`;
