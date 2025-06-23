import dbConnect from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import MessageModel from "@/models/message";
import mongoose from "mongoose";
import ChatroomModel from "@/models/chatroom";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { roomId, message } = await req.json();
    if (!roomId || !message) {
      return Response.json({
        success: false,
        message: "Missing roomId or message text",
      }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "Not authorized",
      }, { status: 401 });
    }

    const userId = session.user._id;

    // Validate user is part of the room
    const chatroom = await ChatroomModel.findById(roomId);
    if (!chatroom || !chatroom.participants.includes(userId)) {
      return Response.json({
        success: false,
        message: "User is not part of this chatroom",
      }, { status: 403 });
    }

    const newMessage = await MessageModel.create({
      _id: new mongoose.Types.ObjectId(),
      senderId: userId,
      roomId,
      message,
    });

    // Update lastMessage in chatroom
    chatroom.lastMessage = newMessage._id;
    await chatroom.save();

    return Response.json({
      success: true,
      message: "Message sent",
      todo: newMessage,
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({
      success: false,
      message: "Error sending message",
    }, { status: 500 });
  }
}
