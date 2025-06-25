"use client";

import { useState } from "react";
import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function QRGenerator() {
  const [tokenId, setTokenId] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      const res = await axios.post<ApiResponse>("/api/qr-gen");
      if (res.data?.id) {
        setTokenId(res.data.id);
        console.log('token id:', tokenId)
        setGenerated(true);
      }
    } catch (err) {
      console.error("QR Generation Failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Generate QR Code for Login</Title>
        <Button onClick={generateQRCode} disabled={loading}>
          {loading ? "Generating..." : "Generate QR Code"}
        </Button>

        {generated && (
          <QRWrapper>
            <QRCodeCanvas
              value={tokenId}
              size={256}
              bgColor="#fff"
              fgColor="#000"
              level='M'
              imageSettings={{
                src: "/logo.png", // ensure logo.png exists in public directory
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
            <QrText>Scan this QR from another device</QrText>
          </QRWrapper>
        )}
      </Card>
    </Wrapper>
  );
}

export default QRGenerator;

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

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QrText = styled.p`
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
`;
