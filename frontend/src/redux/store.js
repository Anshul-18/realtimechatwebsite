import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./messageSlice"
import unreadMessagesSlice from "./unreadMessagesSlice"

export const store=configureStore({
    reducer:{
        user:userSlice,
        message:messageSlice,
        unreadMessages: unreadMessagesSlice
    },
    preloadedState: {
        unreadMessages: {}  // Initialize with empty object
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['user/setSocket'],
                // Ignore these field paths in all actions
                ignoredPaths: ['user.socket'],
            },
        }),
})