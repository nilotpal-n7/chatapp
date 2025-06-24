import { Chatroom } from "@/models/chatroom";
import { User } from "@/models/user";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChatroomDisplayName(room: Chatroom, currentUserId: string | undefined): string {
  if (room.isGroup) return room.name || 'Unnamed Group';

  const other = room.participants.find((user: User) => user._id.toString() !== currentUserId);
  return `${other?.firstName || ''} ${other?.lastName || ''}`.trim() || 'Private Chat';
}

