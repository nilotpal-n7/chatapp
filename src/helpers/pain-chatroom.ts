import { Chatroom } from '@/models/chatroom';
import { PlainMessage } from './plain-message';
import { toPlainMessage } from './plain-message';
import { PlainUser, toPlainUser } from './plain-user';

export interface PlainChatroom {
  _id: string;
  name: string;
  participants: PlainUser[];
  isGroup: boolean;
  createdBy: string;
  lastMessage: PlainMessage | undefined;
  createdAt: string;
  updatedAt: string;
}

export function toPlainChatroom(chatroom: Chatroom): PlainChatroom {
  return {
    _id: chatroom._id.toString(),
    name: chatroom.name,
    participants: chatroom.participants.map(p => toPlainUser(p)),
    isGroup: chatroom.isGroup,
    createdBy: typeof chatroom.createdBy === 'string'
      ? chatroom.createdBy
      : chatroom.createdBy._id.toString(),
    lastMessage: chatroom.lastMessage
      ? toPlainMessage(chatroom.lastMessage)
      : undefined,
    createdAt: chatroom.createdAt.toISOString(),
    updatedAt: chatroom.updatedAt.toISOString(),
  };
}
