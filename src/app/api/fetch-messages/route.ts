import dbConnect from '@/server/db';
import Message from '@/models/message';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return Response.json({
        success: false,
        message: 'Error fetching messages: Missing roomId',
      }, { status: 400 });
    }

    const messages = await Message.find({ roomId }).sort({ sentTime: 1 });
    return Response.json({
      success: true,
      message: 'Messages fetched successfully',
      todos: messages,
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({
      success: false,
      message: 'Error fetching messages',
    }, { status: 500 });
  }
}
