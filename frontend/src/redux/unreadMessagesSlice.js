import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const unreadMessagesSlice = createSlice({
  name: "unreadMessages",
  initialState,
  reducers: {
    incrementUnreadMessages: (state, action) => {
      const { senderId } = action.payload;
      state[senderId] = (state[senderId] || 0) + 1;
    },
    clearUnreadMessages: (state, action) => {
      const { userId } = action.payload;
      state[userId] = 0;
    },
  },
});

export const { incrementUnreadMessages, clearUnreadMessages } = unreadMessagesSlice.actions;
export default unreadMessagesSlice.reducer;
