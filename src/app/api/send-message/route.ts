import dbConnect from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import MessageModel from "@/models/message";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await dbConnect()

        const {id, message} = await req.json()
        if (!id || !message) {
          return Response.json({
            success: false,
            message: "Missing receiver id or message text",
          }, { status: 400 });
        }

        const session = await getServerSession(authOptions)
        if(!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not authorized",
            }, {status: 401})
        }

        const userId = session.user._id

        const newMessage = await MessageModel.create({
          _id: new mongoose.Types.ObjectId(),
          senderId: userId,
          receiverId: id,
          message: message,
          emoji: "",
          watchedBy: 0,
          sentTime: new Date(),
        });

        return Response.json({
          success: true,
          message: "Message sent",
          todo: newMessage,
        });

    } catch (error) {
        console.log('Error sending message', error)
        return Response.json({
          success: false,
          message: "Error sending message",
        }, { status: 500 });
    }
}
