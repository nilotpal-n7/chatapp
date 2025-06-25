import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { storeToken } from '@/lib/qr-token-store';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized access',
    }, { status: 401 });
  }

  const user = session.user;
  const tokenId = storeToken(user._id);

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/credentials?userId=${session.user._id}&tokenId=${tokenId}`;

  return NextResponse.json({
    success: true,
    message: 'QR code generated',
    url: qrUrl,
  }, {status: 200});
}

