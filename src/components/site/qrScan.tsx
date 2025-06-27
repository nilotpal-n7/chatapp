'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { ApiResponse } from '@/types/ApiResponse';
import { useSocket } from '@/hooks/use-socket';

function QRScan() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [scannedTokenId, setScannedTokenId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenIdRef = useRef<string | null>(null);
  const { socket, socketReady } = useSocket();

  useEffect(() => {
    if (!socketReady) return;

    const handleRequest = async ({ clientSocketId }: { clientSocketId: string }) => {
      const tokenId = tokenIdRef.current;
      if (tokenId) {
        await verifyAndLogin(tokenId, clientSocketId);
      }
    };

    socket.on('qr-approval-request', handleRequest);
    return () => {
      socket.off('qr-approval-request', handleRequest);
    };
  }, [socketReady]);

  const verifyAndLogin = async (tokenId: string, socketId: string) => {
    try {
      console.log('entered verify and login function 🔥');
      setLoading(true);
      const res = await axios.post<ApiResponse>('/api/qr-verify', { tokenId });

      if (res.data.success) {
        console.log('🧠 Emitting grant-qr-login to clientSocketId:', socketId);
        socket.emit('grant-qr-login', {
          clientSocketId: socketId,
          tokenId,
        });
      } else {
        setError(res.data.message || '❌ Could not verify token');
      }
    } catch (e) {
      console.error(e);
      setError('❌ Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = useDebouncedCallback(
    async (results: IDetectedBarcode[]) => {
      if (!results?.[0]) return;

      const token = results[0].rawValue;
      if (!scannedTokenId) {
        setScannedTokenId(token);
        tokenIdRef.current = token;
        console.log('📤 Scanner emitting approve-qr-session:', token);
        socket.emit('approve-qr-session', { sessionId: token });
      }
    },
    1000
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const { data } = await axios.post('/api/qr-decode', formData);
      if (data.success && !scannedTokenId) {
        setScannedTokenId(data.id);
        tokenIdRef.current = data.id;
        console.log('📤 Scanner emitting approve-qr-session:', data.id);
        socket.emit('approve-qr-session', { sessionId: data.id });
      } else {
        setError(data.message || '❌ QR not found');
      }
    } catch (err) {
      console.log('Upload failed', err);
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Scanner
        onScan={handleScan}
        onError={(err) => {
          console.error("Scanner Error:", err);
          setPermissionError(true);
          setError('Camera access denied');
        }}
        constraints={{ facingMode: 'environment' }}
      />

      <UploadButton type='button' onClick={() => fileInputRef.current?.click()}>
        Upload Image
      </UploadButton>
      <input hidden ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} />

      {loading && <Loading>⏳ Scanning...</Loading>}
      {error && <ErrorText>{error}</ErrorText>}
      {permissionError && <p>📵 Allow camera access in browser</p>}
    </>
  );
}

export default QRScan;

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

const UploadButton = styled.button`
  background-color: #111;
  margin-top: 10px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;
