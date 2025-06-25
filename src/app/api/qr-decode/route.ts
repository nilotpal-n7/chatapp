import { NextRequest, NextResponse } from 'next/server';
import { Image } from 'image-js';
import { createCanvas, ImageData } from 'canvas';
import { MultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let buffer: Buffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file uploaded');
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const base64 = body.image?.split(',')[1];
      if (!base64) throw new Error('Invalid base64 image');
      buffer = Buffer.from(base64, 'base64');
    } else {
      return NextResponse.json({ success: false, message: 'Unsupported content type' }, { status: 400 });
    }

    const image = await Image.load(buffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const rgba = image.getRGBAData();
    const clamped = new Uint8ClampedArray(rgba);
    const imgData = new ImageData(clamped, image.width, image.height);
    ctx.putImageData(imgData, 0, 0);

    // ZXing requires grayscale buffer
    const luminanceSource = new RGBLuminanceSource(clamped, image.width, image.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    const reader = new MultiFormatReader();
    const result = reader.decode(binaryBitmap);

    return NextResponse.json({ success: true, data: result.getText() });
  } catch (error) {
    console.error('❌ QR decode error:', error);
    return NextResponse.json({ success: false, message: 'No QR code found' }, { status: 404 });
  }
}
