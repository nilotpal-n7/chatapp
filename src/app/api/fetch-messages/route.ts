import dbConnect from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import MessageModel from "@/models/message";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
          success: false,
          message: "Not authorized",
        }, {status: 401});
    }

    const userId = session.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: id },
        { senderId: id, receiverId: userId },
      ],
    }).sort({ sentTime: 1 });

    return Response.json({
      success: true,
      messages: 'All messages fetched',
      todos: messages,
    }, {status: 200});

  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({
        success: false,
        message: "Error fetching messages",
      }, {status: 500});
  }
}
