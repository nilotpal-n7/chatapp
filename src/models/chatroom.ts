// /models/chatroom.ts
import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user';
import { Message } from './message';
import { DUser } from '@/helpers/dim-user';

export interface Chatroom extends Document {
    _id: Types.ObjectId;
    name: string;
    participants: DUser[];
    isGroup: boolean;
    createdBy: User;
    lastMessage: Message;
    createdAt: Date;
    updatedAt: Date;
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
