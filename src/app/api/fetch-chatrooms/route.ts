import ChatroomModel from "@/models/chatroom";
import dbConnect from "@/server/db";
import '@/models/message';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: 'Error fetching chatrooms: Missing userId',
        }, { status: 400 });
    }

    const rooms = await ChatroomModel.find({ participants: userId })
      .populate({
        path: 'participants',
        select: '_id firstName lastName email',
      })
      .populate('lastMessage');

      
    return NextResponse.json({
        success: true,
        message: 'Chatrooms fetched successfully',
        rooms: rooms,
    });

  } catch (error) {
    console.error('Error fetching user chatrooms:', error);
    return NextResponse.json({
        success: false,
        message: 'Error fetching user chatrooms',
    }, { status: 500 });
  }
}
