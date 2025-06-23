// In messageSlice.ts or a separate chatroomSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chatroom } from '@/models/chatroom';

export const fetchChatrooms = createAsyncThunk(
  'chatroom/fetch-chatrooms',
  async (userId: string) => {
    const response = await axios.get('/api/fetch-chatrooms', { params: { userId } });
    return response.data.rooms as Chatroom[];
  }
);

export const createChatroom = createAsyncThunk(
  'chatroom/create-chatroom',
  async ({userId, isGroup, name}: {userId: string, isGroup: boolean, name: string}) => {
    const response = await axios.post('/api/create-chatroom', {userId, isGroup, name})
    return response.data.room as Chatroom
  }
)

interface ChatroomState {
  chatrooms: Chatroom[];
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatrooms.fulfilled, (state, action: PayloadAction<Chatroom[]>) => {
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
      .addCase(createChatroom.fulfilled, (state, action: PayloadAction<Chatroom>) => {
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
export const {setRoomId} = chatroomSlice.actions
