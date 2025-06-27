// app/api/qr-decode

import { NextRequest, NextResponse } from 'next/server';
import { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Image } from 'image-js';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let buffer: Buffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file uploaded.');
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const base64 = body.image?.split(',')[1];
      if (!base64) throw new Error('Base64 image missing.');
      buffer = Buffer.from(base64, 'base64');
    } else {
      return NextResponse.json({ success: false, message: 'Unsupported content type' }, { status: 400 });
    }

    // 🖼️ Decode image using image-js
    const image = await Image.load(buffer);
    const rgba = image.getRGBAData();
    const clamped = new Uint8ClampedArray(rgba);
    const luminanceSource = new RGBLuminanceSource(clamped, image.width, image.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const reader = new MultiFormatReader();
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    reader.setHints(hints);

    const result = reader.decode(binaryBitmap);

    return NextResponse.json({
      success: true,
      message: 'qr decoded successfully',
      id: result.getText(),
    }, {status: 201});
    
  } catch (error) {
    console.error('❌ QR decode error:', error);
    return NextResponse.json({ success: false, message: 'No QR code found' }, { status: 404 });
  }
}
