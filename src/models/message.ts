import mongoose, { Schema, Types } from 'mongoose'
import { User } from './user';
import { Chatroom } from './chatroom';

export interface Message extends Document {
    _id: Types.ObjectId;
    senderId: User;
    roomId: Chatroom;
    isRead: boolean;
    isSent: boolean;
    isReceived: boolean;
    isStarred: boolean;
    message: string;
    emoji: string;
    watchedBy: number;
    sentTime: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Chatroom',
        required: true,
    },
    isReceived: {
        type: Boolean,
        default: false,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isStarred: {
        type: Boolean,
        default: false,
    },
    isSent: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: '',
    },
    emoji: {
        type: String,
        default: '',
    },
    watchedBy: {
        type: Number,
        default: 0,
    },
    sentTime: {
        type: Date,
        default: Date.now(),
        required: true,
    }
}, {timestamps: true})

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>('Message', MessageSchema))
export default MessageModel
