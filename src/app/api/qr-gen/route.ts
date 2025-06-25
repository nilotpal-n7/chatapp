import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/server/db';
import { nanoid } from 'nanoid';
import QRTokenModel from '@/models/qrToken';

export async function POST() {
  try {
    dbConnect()
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }

    const tokenId = nanoid(12);
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  
    await QRTokenModel.create({
      tokenId,
      userId: session.user._id,
      expiry,
    });

    return NextResponse.json({
      success: true,
      message: 'QR code generated',
      id: tokenId,
    }, {status: 200});

  } catch (error) {
    console.log('error generating qr code', error)
    return NextResponse.json({
      success: false,
      message: 'error generating qr code',
    }, {status: 401})
  }
}
