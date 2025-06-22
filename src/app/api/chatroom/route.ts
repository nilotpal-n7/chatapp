import { NextRequest } from 'next/server';
import Chatroom from '@/models/chatroom';
import dbConnect from '@/server/db';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userIds, isGroup, name, createdBy } = body;

    if (!Array.isArray(userIds) || userIds.length < 2) {
      return Response.json({ success: false, message: 'At least two participants required' }, { status: 400 });
    }

    if (!isGroup) {
      // For private chat: check if chatroom already exists
      const existing = await Chatroom.findOne({
        participants: { $all: userIds, $size: 2 },
        isGroup: false,
      });

      if (existing) {
        return Response.json({ success: true, room: existing });
      }
    }

    const newRoom = await Chatroom.create({
      name,
      participants: userIds,
      isGroup,
      createdBy,
    });

    return Response.json({ success: true, room: newRoom });
  } catch (error) {
    console.error('Error creating/joining chatroom:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    const rooms = await Chatroom.find({ participants: userId }).populate('lastMessage');
    return Response.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching user chatrooms:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
