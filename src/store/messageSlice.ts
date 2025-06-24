import { PlainMessage, toPlainMessage } from "@/helpers/plain-message";
import { Message } from "@/models/message";
import { ApiResponse } from "@/types/ApiResponse";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
    'message/fetch-messages',
    async (roomId: string) => {
        const response = await axios.get<ApiResponse>('/api/fetch-messages', {params: {roomId}})
        return response.data.todos as Message[]
    }
)

export const sendMessage = createAsyncThunk(
    'message/send-message',
    async ({roomId, message}: {roomId: string, message: string}) => {
        const response = await axios.post<ApiResponse>('/api/send-message', {roomId, message})
        return response.data.todo as Message
    }
)

interface MessageState {
    messages: PlainMessage[]
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
        clearMessages: (state) => {
            state.messages = []
        },

        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(toPlainMessage(action.payload));
        },
     },
     

     extraReducers: (builder) => {
        builder

        .addCase(fetchMessages.pending, state => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false
            state.messages = action.payload.map(doc => toPlainMessage(doc))
        })
        .addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message || 'Failed to fetch messages'
        })
        .addCase(sendMessage.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.loading = false;
          state.messages.push(toPlainMessage(action.payload));
        })
        .addCase(sendMessage.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to send message';
        });
     }
})

export default messageSlice.reducer
export const { clearMessages, addMessage } = messageSlice.actions
