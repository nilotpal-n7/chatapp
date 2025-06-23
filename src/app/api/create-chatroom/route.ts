import ChatroomModel from '@/models/chatroom';
import dbConnect from '@/server/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const {userId, isGroup, name} = await req.json()
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user._id) {
      return Response.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const userIds = [session.user._id, userId]

    if (!Array.isArray(userIds) || userIds.length < 2) {
      return Response.json({ success: false, message: 'At least two participants required' }, { status: 400 });
    }

    if (!isGroup) {
      // For private chat: check if chatroom already exists
      const existing = await ChatroomModel.findOne({
        participants: { $all: userIds, $size: 2 },
        isGroup: false,
      });

      if (existing) {
        return Response.json({
          success: true,
          message: 'Chatroom joined successfully',
          room: existing,
        });
      }
    }

    const newRoom = await ChatroomModel.create({
      name,
      participants: userIds,
      isGroup,
      createdBy: userIds[0],
    });

    return Response.json({
      success: true,
      message: 'Chatroom created successfully',
      room: newRoom,
    });
    
  } catch (error) {
    console.error('Error creating/joining chatroom:', error);
    return Response.json({
      success: false,
      message: 'Error creating/joining chatroom',
    }, { status: 500 });
  }
}
