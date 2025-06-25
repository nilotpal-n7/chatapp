import { getTokenData } from '@/lib/qr-token-store';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { tokenId } = await req.json();

  const data = getTokenData(tokenId);
  if (!data) {
    return NextResponse.json({
      success: false,
      message: 'Invalid or expired token',
    }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: 'QR code verified successfully',
    userId: data.userId,
  }, {status: 200});
}
