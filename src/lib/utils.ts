import { PlainChatroom } from "@/helpers/pain-chatroom";
import { PlainUser } from "@/helpers/plain-user";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChatroomDisplayName(room: PlainChatroom, currentUserId: string | undefined): string {
  if (room.isGroup) return room.name || 'Unnamed Group';

  const other = room.participants.find((user: PlainUser) => user._id !== currentUserId);
  return `${other?.firstName || ''} ${other?.lastName || ''}`.trim() || 'Private Chat';
}
