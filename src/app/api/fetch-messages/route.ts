import dbConnect from '@/server/db';
import Message from '@/models/message';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({
        success: false,
        message: 'Error fetching messages: Missing roomId',
      }, { status: 400 });
    }

    const messages = await Message.find({ roomId }).sort({ sentTime: 1 });
    return NextResponse.json({
      success: true,
      message: 'Messages fetched successfully',
      todos: messages,
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching messages',
    }, { status: 500 });
  }
}
