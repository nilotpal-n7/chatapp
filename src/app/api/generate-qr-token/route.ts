// ✅ Updated API: /api/generate-qr-token.ts (with expiry)
import dbConnect from '@/server/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

const qrTokens = new Map(); // temporary in-memory store

export async function POST() {
  await dbConnect();

  const session = await getServerSession(authOptions)
  if(!session || !session?.user) {
    return NextResponse.json({
      success: false,
      message: 'QR generation failed',
    }, {status: 500})
  }

  const user = session.user
  const tokenId = crypto.randomUUID();
  const expiry = Date.now() + 2 * 60 * 1000; // 2 minutes

  qrTokens.set(tokenId, { userId: user._id.toString(), expiry });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/credentials?userId=${user._id}&tokenId=${tokenId}`;

  return NextResponse.json({ success: true, url });
}

export function getTokenData(tokenId: string) {
  const data = qrTokens.get(tokenId);
  if (!data || data.expiry < Date.now()) {
    qrTokens.delete(tokenId);
    return null;
  }
  return data;
}
