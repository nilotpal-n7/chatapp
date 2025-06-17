import { Message } from "@/models/message";

export interface ApiResponse {
    success: boolean;
    message: string;
    todo?: Message;
    todos?: Array<Message>
}
