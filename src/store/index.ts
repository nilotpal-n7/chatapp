import { configureStore } from '@reduxjs/toolkit'
import messageReducer from '@/store/messageSlice'

export const store = configureStore({
    reducer: messageReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
