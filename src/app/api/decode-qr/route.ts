// /app/api/decode-qr/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let formData: FormData;

  // Ensure multipart/form-data (file upload) or base64 payload
  if (contentType.includes('multipart/form-data')) {
    formData = await req.formData();
  } else {
    const body = await req.json();
    if (!body.image) {
      return NextResponse.json({ success: false, message: 'No image data' }, { status: 400 });
    }

    formData = new FormData();
    const blob = Buffer.from(body.image.split(',')[1], 'base64');
    formData.append('file', new Blob([blob]), 'qr.png');
  }

  try {
    const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const text = data?.[0]?.symbol?.[0]?.data;

    if (text) {
      return NextResponse.json({ success: true, data: text });
    } else {
      return NextResponse.json({ success: false, message: 'No QR code found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Decode API Error:', error);
    return NextResponse.json({ success: false, message: 'QR decoding failed' }, { status: 500 });
  }
}
