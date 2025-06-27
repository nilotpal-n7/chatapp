// app/api/qr-gen

import { NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import QRTokenModel from '@/models/qrToken';

export async function POST() {
  try {
    await dbConnect()

    const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    const token = await QRTokenModel.create({
      expiry,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'QR code generated',
      id: token._id,
    }, {status: 200});

  } catch (error) {
    console.log('error generating qr code', error)
    return NextResponse.json({
      success: false,
      message: 'error generating qr code',
    }, {status: 401})
  }
}
