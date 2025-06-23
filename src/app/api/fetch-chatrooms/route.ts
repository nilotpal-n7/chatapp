import ChatroomModel from "@/models/chatroom";
import dbConnect from "@/server/db";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return Response.json({
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

      
    return Response.json({
        success: true,
        message: 'Chatrooms fetched successfully',
        rooms: rooms,
    });

  } catch (error) {
    console.error('Error fetching user chatrooms:', error);
    return Response.json({
        success: false,
        message: 'Error fetching user chatrooms',
    }, { status: 500 });
  }
}
