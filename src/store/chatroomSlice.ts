// In messageSlice.ts or a separate chatroomSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chatroom } from '@/models/chatroom';
import { Message } from '@/models/message';
import { ApiResponse } from '@/types/ApiResponse';
import { PlainChatroom, toPlainChatroom } from '@/helpers/pain-chatroom';
import { toPlainMessage } from '@/helpers/plain-message';

export const fetchChatrooms = createAsyncThunk(
  'chatroom/fetch-chatrooms',
  async (userId: string | undefined) => {
    const response = await axios.get<ApiResponse>('/api/fetch-chatrooms', { params: { userId } });
    return response.data.rooms as Chatroom[];
  }
);

export const createChatroom = createAsyncThunk(
  'chatroom/create-chatroom',
  async ({userId, isGroup, name}: {userId: string, isGroup: boolean, name: string}) => {
    const response = await axios.post<ApiResponse>('/api/create-chatroom', {userId, isGroup, name})
    return response.data.room as Chatroom
  }
)

interface ChatroomState {
  chatrooms: PlainChatroom[];
  roomId: string,
  loading: boolean;
  error: string | null;
}

const initialState: ChatroomState = {
  chatrooms: [],
  roomId: '',
  loading: false,
  error: null,
};

const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },

    updateLastMessage: (state, action: PayloadAction<{ message: Message }>) => {
      const room = state.chatrooms.find(r => r._id.toString() === action.payload.message.roomId.toString());
      if (room) {
        room.lastMessage = toPlainMessage(action.payload.message);
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatrooms.fulfilled, (state, action: PayloadAction<Chatroom[]>) => {
        state.loading = false;
        state.chatrooms = action.payload.map(room => toPlainChatroom(room));
      })
      .addCase(fetchChatrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load chatrooms';
      })
      .addCase(createChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatroom.fulfilled, (state, action: PayloadAction<Chatroom>) => {
        state.loading = false;
        state.chatrooms.push(toPlainChatroom(action.payload));
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load chatrooms';
      });
  },
});

export default chatroomSlice.reducer;
export const {setRoomId, updateLastMessage} = chatroomSlice.actions
