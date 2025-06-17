import { ChatMessage } from "@/types/ChatMessage";
import { createSlice, nanoid } from "@reduxjs/toolkit";

interface MessageState {
    messages: ChatMessage[]
    loading: boolean,
    error: string | null,
}

const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const message: ChatMessage = {
                id: nanoid(),
                senderId: action.payload.senderId,
                receiverId: action.payload.receiverId,
                message: action.payload.message,
            }
            state.messages.push(message)
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter((todo) => todo.id != action.payload.id)
        }
    }
})

export default messageSlice.reducer
export const { addMessage, removeMessage } = messageSlice.actions
