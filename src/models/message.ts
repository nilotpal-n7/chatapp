import mongoose, { Schema } from 'mongoose'

export interface Message extends Document {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
}

export const MessageSchema: Schema<Message> = new Schema({
    id: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: [true, 'sender id is required'],
    },
    receiverId: {
        type: String,
        required: [true, 'receiver id is required']
    },
    message: {
        type: String,
        default: '',
    },
})

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>('Message', MessageSchema))
export default MessageModel
