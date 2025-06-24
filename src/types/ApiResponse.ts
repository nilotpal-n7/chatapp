import { Chatroom } from "@/models/chatroom";
import { Message } from "@/models/message";
import { User } from "@/models/user";

export interface ApiResponse {
    success: boolean;
    message: string;
    todo?: Message;
    todos?: Array<Message>;
    room?: Chatroom;
    rooms?: Array<Chatroom>;
    user?: User;
    users?: Array<User>;
    name?: string;
}
