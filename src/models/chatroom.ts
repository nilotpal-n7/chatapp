// /models/chatroom.ts
import mongoose, { Schema } from 'mongoose';
import { User } from './user';
import { Message } from './message';

export interface Chatroom extends Document {
    name: string;
    participants: User[];
    isGroup: boolean;
    createdBy: User;
    lastMessage?: Message;
}

const chatroomSchema: Schema<Chatroom> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Chatroom'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    isGroup: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
},  {timestamps: true,});

const ChatroomModel = (mongoose.models.Chatroom) as mongoose.Model<Chatroom> || (mongoose.model<Chatroom>("Chatroom", chatroomSchema))
export default ChatroomModel
