// components/site/qrGen

"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn } from "next-auth/react";
import socket from "@/lib/socket";

function QRGenerator() {
  const [tokenId, setTokenId] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenId) return;

    socket.emit("create-qr-session", tokenId);
    console.log("🎉 QR session created with tokenId:", tokenId);

    socket.on("qr-login-success", async ({ tokenId }) => {
      console.log("🎉 QR login success received with tokenId:", tokenId);

      const res = await signIn('credentials', {
        tokenId,
        redirect: true,
        callbackUrl: '/dashboard',
      });

      console.log("🔐 signIn response:", res);
    });

    return () => {
      socket.off("qr-login-success");
    };
  }, [tokenId]);

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    setLoading(true);
    setGenerated(false);

    try {
      const res = await axios.post<ApiResponse>("/api/qr-gen");
      if (res.data?.id) {
        setTokenId(res.data.id)
        setGenerated(true);
      }

    } catch (err) {
      console.error("QR Generation Failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {generated && (<>
        <QRWrapper>
          <QRCodeCanvas
            value={tokenId}
            size={200}
            bgColor="#fff"
            fgColor="#000"
            level='H'
            imageSettings={{
              src: "/logo.png", // ensure logo.png exists in public directory
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </QRWrapper>
        <QrText>Scan this QR from another device</QrText>
        </>
      )}
      <GenButton onClick={generateQRCode} disabled={loading}>
        {loading ? "Generating..." : "Generate QR"}
      </GenButton>
    </>
  );
}

export default QRGenerator;

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 10px;
`;

const QrText = styled.p`
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
`;

const GenButton = styled.button`
  background-color: #111;
  margin-top: 10px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  color: #fff;
`
