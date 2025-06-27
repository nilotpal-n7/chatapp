// /app/api/qr-verify.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/server/db';
import QRTokenModel from '@/models/qrToken';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { tokenId } = await req.json();

    if (!tokenId) {
      return NextResponse.json(
        { success: false, message: 'Missing token ID' },
        { status: 400 }
      );
    }

    const token = await QRTokenModel.findById(tokenId);

    if (!token || token.expiry < new Date()) {
      if (token) await QRTokenModel.deleteOne({ _id: tokenId });
      return NextResponse.json(
        { success: false, message: 'Token is invalid or expired' },
        { status: 400 }
      );
    }

    // Update token status and bind user
    token.status = 'approved';
    token.userId = session.user._id;
    await token.save();

    return NextResponse.json({
      success: true,
      message: 'QR login approved',
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error verifying QR:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error during QR verification',
    }, { status: 500 });
  }
}
