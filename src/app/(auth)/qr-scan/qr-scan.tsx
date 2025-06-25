'use client';

import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useDebouncedCallback } from 'use-debounce';

function QRScanPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [permissionError, setPermissionError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('scan-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveHistory = (url: string) => {
    const updated = [url, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem('scan-history', JSON.stringify(updated));
  };

  const verifyAndLogin = async (tokenId: string) => {
    try {
      setLoading(true);
      saveHistory(tokenId);

      await signIn('credentials', {
        tokenId,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch (e) {
      console.error(e);
      setError('❌ Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = useDebouncedCallback(
    async (results: IDetectedBarcode[]) => {
      console.log('result scan', results)
      if (!results || !Array.isArray(results) || !results[0]) return;

      const text = results[0].rawValue;
      await verifyAndLogin(text);
    },
    2000 // 2s debounce
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const { data } = await axios.post('/api/qr-decode', formData);
      if (data.success) {
        await verifyAndLogin(data.data);
      } else {
        setError(data.message || '❌ QR not found');
      }
    } catch (err) {
      console.log('Upload failed', err)
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <h2>QR Code Scanner</h2>

        <ScannerWrapper>
          <Scanner
            onScan={handleScan}
            onError={(err) => {
              console.error("Scanner Error:", err);
              setPermissionError(true);
              setError('Camera access denied');
            }}
            constraints={{ facingMode: 'environment' }}
          />
        </ScannerWrapper>

        <button onClick={() => fileInputRef.current?.click()}>📁 Upload Image</button>
        <input hidden ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} />

        {loading && <Loading>⏳ Scanning...</Loading>}
        {error && <ErrorText>{error}</ErrorText>}
        {permissionError && <p>📵 Allow camera access in browser</p>}

        {history.length > 0 && (
          <History>
            <h4>Scan History:</h4>
            <ul>{history.map((url, i) => <li key={i}>{url}</li>)}</ul>
          </History>
        )}
      </Card>
    </Wrapper>
  );
}

export default QRScanPage;

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

const ScannerWrapper = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 16px;
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
