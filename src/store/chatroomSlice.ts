// In messageSlice.ts or a separate chatroomSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chatroom } from '@/models/chatroom';
import { ApiResponse } from '@/types/ApiResponse';
import { PlainChatroom, toPlainChatroom } from '@/helpers/plain-chatroom';

export const fetchChatrooms = createAsyncThunk(
  'chatroom/fetch-chatrooms',
  async () => {
    const response = await axios.get<ApiResponse>('/api/fetch-chatrooms');
    const res = response.data.rooms as Chatroom[];
    return res.map(c => toPlainChatroom(c))
  }
);

export const createChatroom = createAsyncThunk(
  'chatroom/create-chatroom',
  async ({userId, isGroup, name}: {userId: string, isGroup: boolean, name: string}) => {
    const response = await axios.post<ApiResponse>('/api/create-chatroom', {userId, isGroup, name})
    const res = response.data.room as Chatroom
    return toPlainChatroom(res)
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
    setRoomId: (state, action) => {
      state.roomId = action.payload
    },

    updateLastMessage: (state, action) => {
      const room = state.chatrooms.find(r => r._id.toString() === action.payload.message.roomId.toString());
      if (room) {
        room.lastMessage = action.payload.message;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatrooms = action.payload;
      })
      .addCase(fetchChatrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load chatrooms';
      })
      .addCase(createChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatroom.fulfilled, (state, action) => {
        state.loading = false;
        state.chatrooms.push(action.payload);
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load chatrooms';
      });
  },
});

export default chatroomSlice.reducer;
export const {setRoomId, updateLastMessage} = chatroomSlice.actions
