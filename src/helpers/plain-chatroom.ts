import { Chatroom } from '@/models/chatroom';
import { PlainMessage } from './plain-message';
import { toPlainMessage } from './plain-message';
import { DimUser, toDimUser } from './dim-user';

export interface PlainChatroom {
  _id: string;
  name: string;
  participants: DimUser[];
  isGroup: boolean;
  createdBy: string;
  lastMessage: PlainMessage | undefined;
  createdAt: string;
  updatedAt: string;
}

export function toPlainChatroom(chatroom: Chatroom) {
  return {
    _id: chatroom._id.toString(),
    name: chatroom.name,
    isGroup: chatroom.isGroup,
    participants: chatroom.participants.map(p => toDimUser(p)),
    createdBy: chatroom.createdBy.toString(),
    lastMessage: chatroom.lastMessage
      ? toPlainMessage(chatroom.lastMessage)
      : undefined,
    createdAt: new Date(chatroom.createdAt).toISOString(),
    updatedAt: new Date(chatroom.updatedAt).toISOString(),
  };
}
