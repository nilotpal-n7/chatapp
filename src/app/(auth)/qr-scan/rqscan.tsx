'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { BrowserQRCodeReader } from '@zxing/browser';
import jsQR from 'jsqr';

function ScanQRPage() {
  const [errorText, setErrorText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const verifyAndRedirect = async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? new URL(url) : new URL(url, window.location.origin);

      if (!fullUrl.pathname.includes('/api/auth/callback/credentials')) {
        setErrorText('⚠️ Invalid QR code.');
        return;
      }

      const tokenId = fullUrl.searchParams.get('tokenId');
      if (!tokenId) {
        setErrorText('⚠️ Token ID missing in QR.');
        return;
      }

      const res = await fetch('/api/verify-qr-token', {
        method: 'POST',
        body: JSON.stringify({ tokenId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!data.success) {
        setErrorText(data.message || 'QR login failed.');
        return;
      }

      router.push(fullUrl.href);
    } catch (err) {
      console.error(err);
      setErrorText('Unexpected error occurred.');
    }
  };

  const handleLiveScan = async (results: IDetectedBarcode[]) => {
    if (!results?.length) return;
    const url = results[0].rawValue;
    console.log('✅ QR scanned (live):', url);
    await verifyAndRedirect(url);
  };

  const handleLiveError = (error: unknown) => {
    console.error('❌ Live Scanner Error:', error);
    if (error instanceof Error) {
      setErrorText(error.message);
    }
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const img = new Image();
  //     img.onload = async () => {
  //       try {
  //         const codeReader = new BrowserQRCodeReader();
  //         const result = await codeReader.decodeFromImageElement(img);
  //         console.log('✅ QR decoded (upload):', result.getText());
  //         await verifyAndRedirect(result.getText());
  //       } catch (err) {
  //         console.error('❌ QR decode error (upload):', err);
  //         setErrorText('⚠️ No QR code found in image.');
  //       }
  //     };

  //     img.onerror = () => setErrorText('❌ Failed to load image.');
  //     img.src = reader.result as string;
  //   };

  //   reader.onerror = () => setErrorText('❌ Failed to read file.');
  //   reader.readAsDataURL(file);
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorText('⚠️ Canvas rendering failed.');
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          console.log('✅ QR decoded (upload):', code.data);
          verifyAndRedirect(code.data);
        } else {
          console.warn('⚠️ QR decode failed. Try a clearer QR.');
          setErrorText('⚠️ No QR code found in image.');
        }
      };

      img.onerror = () => setErrorText('⚠️ Failed to load image.');
      img.src = reader.result as string;
    };

    reader.onerror = () => setErrorText('⚠️ Failed to read image.');
    reader.readAsDataURL(file);
  };

  return (
    <Wrapper>
      <Card>
        <Title>Scan or Upload QR Code</Title>

        <ScannerWrapper>
          <Scanner
            onScan={handleLiveScan}
            onError={handleLiveError}
            constraints={{ facingMode: 'environment' }}
          />
        </ScannerWrapper>

        <UploadButton onClick={() => fileInputRef.current?.click()}>
          Upload QR Image
        </UploadButton>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        {errorText && <ErrorText>{errorText}</ErrorText>}
        <HintText>Scan or upload a valid QR code to log in</HintText>
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
  width: 340px;
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

const UploadButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
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
