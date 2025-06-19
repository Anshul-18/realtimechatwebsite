import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
   name: "user",
   initialState: {
    userData:null,
    otherUsers:null,
    selectedUser:null,
    socketId:null,  // Change socket to socketId
    onlineUsers:null,
    searchData:null,
    unreadMessages: {},  // Add this new state
    darkMode: false,
   },  
   reducers:{
    setUserData:(state,action)=>{
   state.userData=action.payload
    },
    setOtherUsers:(state,action)=>{
      state.otherUsers=action.payload
       },
       setSelectedUser:(state,action)=>{
         state.selectedUser=action.payload
          }
          ,
          setSocket:(state,action)=>{
            state.socketId = action.payload?.id || null  // Only store socket ID
             },
             setOnlineUsers:(state,action)=>{
              state.onlineUsers=action.payload
               },
               setSearchData:(state,action)=>{
                state.searchData = action.payload
                 },
                 incrementUnreadMessages: (state, action) => {
                    const { senderId } = action.payload;
                    state.unreadMessages[senderId] = (state.unreadMessages[senderId] || 0) + 1;
                },
                clearUnreadMessages: (state, action) => {
                    const { userId } = action.payload;
                    state.unreadMessages[userId] = 0;
                },
                toggleDarkMode: (state) => {
                  state.darkMode = !state.darkMode;
                }
   }
})

export const {setUserData, setOtherUsers,setSelectedUser,setSocket,setOnlineUsers,setSearchData, incrementUnreadMessages, clearUnreadMessages, toggleDarkMode}=userSlice.actions
export default userSlice.reducer