import { configureStore } from '@reduxjs/toolkit'
import messageReducer from '@/store/messageSlice'
import chatroomReducer from '@/store/chatroomSlice'

export const store = configureStore({
    reducer: {
        message: messageReducer,
        chatroom: chatroomReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
