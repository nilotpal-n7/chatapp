import { Message } from "@/models/message";

export interface PlainMessage {
  _id: string;
  senderId: string;
  roomId: string;
  isRead: boolean;
  isSent: boolean;
  isReceived: boolean;
  isStarred: boolean;
  message: string;
  emoji: string;
  watchedBy: number;
  sentTime: string;
  createdAt: string;
  updatedAt: string;
}

export function toPlainMessage(doc: Message): PlainMessage {
  return {
    _id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    roomId: doc.roomId.toString(),
    isRead: doc.isRead,
    isSent: doc.isSent,
    isReceived: doc.isReceived,
    isStarred: doc.isStarred,
    message: doc.message,
    emoji: doc.emoji,
    watchedBy: doc.watchedBy,
    sentTime: doc.sentTime.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
