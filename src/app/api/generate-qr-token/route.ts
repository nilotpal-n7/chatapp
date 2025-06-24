import dbConnect from '@/server/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { storeToken } from '@/lib/qr-token-store';

export async function POST() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return NextResponse.json({ success: false, message: 'QR generation failed' }, { status: 500 });
  }

  const user = session.user;
  const tokenId = storeToken(user._id.toString());

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/credentials?userId=${user._id}&tokenId=${tokenId}`;

  return NextResponse.json({ success: true, url });
}
