import ChatroomModel from "@/models/chatroom";
import dbConnect from "@/server/db";
import '@/models/message';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions)

    if(!session || !session.user) {
        return NextResponse.json({
            success: false,
            messaage: 'Unauthorized access'
        }, {status: 400})
    }

    const rooms = await ChatroomModel.find({ participants: session.user._id })
      .populate({
        path: 'participants',
        select: '_id firstName lastName email',
      })
      .populate('lastMessage');

    const nrooms = rooms.map(room => {
      const other = room.participants.find(p => p._id.toString() !== session.user._id)
      room.name = room.isGroup
        ? room.name
        : `${other?.firstName || ''} ${other?.lastName || ''}`

      return room
    })
      
    return NextResponse.json({
        success: true,
        message: 'Chatrooms fetched successfully',
        rooms: nrooms,
    });

  } catch (error) {
    console.error('Error fetching user chatrooms:', error);
    return NextResponse.json({
        success: false,
        message: 'Error fetching user chatrooms',
    }, { status: 500 });
  }
}
