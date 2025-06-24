// /api/verify-qr-token.ts
import { NextResponse } from 'next/server';
import { getTokenData } from '../generate-qr-token/route';

export async function POST(req: Request) {
  const { tokenId } = await req.json();

  const data = getTokenData(tokenId);
  if (!data) {
    return NextResponse.json({ success: false, message: 'QR Token expired or invalid' }, { status: 401 });
  }

  return NextResponse.json({ success: true, userId: data.userId });
}
