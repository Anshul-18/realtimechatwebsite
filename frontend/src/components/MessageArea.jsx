import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiAttachment2 } from "react-icons/ri"; // Add this import
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';
import { clearUnreadMessages, incrementUnreadMessages } from '../redux/unreadMessagesSlice';

function MessageArea() {
  let { selectedUser, userData, socketId, onlineUsers } = useSelector(state => state.user)
  let { messages } = useSelector(state => state.message)
  const { unreadMessages } = useSelector(state => state.unreadMessages)
  const socketRef = useRef(null)
  let dispatch = useDispatch()
  let [showPicker,setShowPicker]=useState(false)
  let [input,setInput]=useState("")
  let [frontendImage,setFrontendImage]=useState(null)
  let [backendImage,setBackendImage]=useState(null)
  let image=useRef()
  let fileInput = useRef() // Add new ref for files
  
  // Handle new messages
  useEffect(() => {
    if (socketId) {
      socketRef.current = io(`${serverUrl}`).connect()
      
      socketRef.current?.on("newMessage", (mess) => {
        dispatch(setMessages(messages ? [...messages, mess] : [mess]))
        
        // Only increment unread for messages not from current user and not in current chat
        if (mess.sender !== userData._id && (!selectedUser || mess.sender !== selectedUser._id)) {
          dispatch(incrementUnreadMessages({ senderId: mess.sender }))
        }
      })

      return () => socketRef.current?.close()
    }
  }, [socketId, messages, selectedUser])

  // Clear unread messages when selecting a user
  useEffect(() => {
    if (selectedUser) {
      dispatch(clearUnreadMessages({ userId: selectedUser._id }));
    }
  }, [selectedUser]);

  const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
      }
  
  const handleFile = (e) => {
    let file = e.target.files[0]
    if (!file) return;
    
    setBackendImage(file)
    if (file.type.startsWith('image/')) {
        setFrontendImage(URL.createObjectURL(file))
    } else {
        setFrontendImage(null)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.length === 0 && !backendImage) return;

    try {
        const formData = new FormData()
        if (input) formData.append("message", input)
        if (backendImage) formData.append("image", backendImage)

        const result = await axios.post(
            `${serverUrl}/api/message/send/${selectedUser._id}`,
            formData,
            {withCredentials: true}
        )
        dispatch(setMessages([...messages, result.data]))
        setInput("")
        setFrontendImage(null)
        setBackendImage(null)
    } catch (error) {
        console.log(error)
    }
}
    const onEmojiClick =(emojiData)=>{
   setInput(prevInput=>prevInput+emojiData.emoji)
   setShowPicker(false)
    }

  // Add file size formatter
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

   
    return (
        <div className={`lg:w-[70%] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-[#f8fafc] dark:bg-gray-900 overflow-hidden`}>
      {selectedUser && 
          <div className='w-full h-[100vh] flex flex-col overflow-hidden'>
              <div className='w-full h-[80px] px-6 flex items-center gap-4 bg-gradient-to-r from-[#6366f1] to-[#4f46e5]'>
                  <div className='flex items-center gap-4'>
                      <button onClick={()=>dispatch(setSelectedUser(null))} 
                          className='p-2 rounded-full hover:bg-white/10 transition-colors'>
                          <IoIosArrowRoundBack className='w-[30px] h-[30px] text-white'/>
                      </button>
                      <div className='flex items-center gap-3'>
                          <div className='w-[45px] h-[45px] rounded-full overflow-hidden'>
                              <img src={selectedUser?.image || dp} alt="" className='h-full w-full object-cover'/>
                          </div>
                          <div>
                              <h3 className='font-medium text-white'>{selectedUser?.name || selectedUser?.userName || "You"}</h3>
                              <p className='text-sm text-white/70'>{onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className='flex-1 overflow-auto p-6'>
                  {messages && messages.map((mess, index) => (
                      <div key={index} className="mb-4">
                          {mess.sender === userData._id ? 
                              <SenderMessage image={mess.image} message={mess.message} file={mess.file}/> : 
                              <ReceiverMessage image={mess.image} message={mess.message} file={mess.file}/>
                          }
                      </div>
                  ))}
                  {showPicker && (
                      <div className='absolute bottom-[120px] left-[20px]'>
                          <EmojiPicker width={300} height={400} theme="light" className='shadow-lg'
                              onEmojiClick={onEmojiClick}
                          />
                      </div>
                  )}
              </div>

              {/* Update message input area for dark mode */}
              <div className='p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700'>
                  <form className='flex items-center gap-4 px-4' onSubmit={handleSendMessage}>
                      <button type="button" 
                          onClick={()=>setShowPicker(prev=>!prev)}
                          className='text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#818cf8] transition-colors'
                      >
                          <RiEmojiStickerLine className='w-6 h-6'/>
                      </button>
                      
                      <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>
                      <input type="file" accept="*/*" ref={fileInput} hidden onChange={handleFile}/>
                      <input type="text" 
                          className='flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] dark:focus:ring-[#818cf8] transition-all'
                          placeholder='Type a message...'
                          value={input}
                          onChange={(e)=>setInput(e.target.value)}
                      />
                      
                      {/* Update file preview for dark mode */}
                      {backendImage && !frontendImage && (
                          <div className='absolute bottom-[80px] left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center gap-2'>
                              <RiAttachment2 className='w-5 h-5 text-gray-500 dark:text-gray-400'/>
                              <div>
                                  <p className='text-sm font-medium dark:text-white'>{backendImage.name}</p>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>{formatFileSize(backendImage.size)}</p>
                              </div>
                          </div>
                      )}
                      
                      <div className='flex items-center gap-2'>
                          <button type="button" 
                            onClick={() => image.current.click()} 
                            className='text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#818cf8] transition-colors'
                          >
                              <FaImages className='w-6 h-6'/>
                          </button>
                          <button type="button"
                            onClick={() => fileInput.current.click()}
                            className='text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#818cf8] transition-colors'
                          >
                              <RiAttachment2 className='w-6 h-6'/>
                          </button>
                      </div>
                      
                      {(input.length>0 || backendImage) && (
                          <button type="submit" 
                              className='text-[#6366f1] dark:text-[#818cf8] hover:text-[#4f46e5] dark:hover:text-[#6366f1] transition-colors'
                          >
                              <RiSendPlane2Fill className='w-6 h-6'/>
                          </button>
                      )}
                  </form>
              </div>
          </div>
      }
      
      {!selectedUser && 
          <div className='w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
              <div className='text-center space-y-4'>
                  <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>Welcome to Chatify</h1>
                  <p className='text-gray-500 dark:text-gray-400'>Select a conversation to start messaging</p>
              </div>
          </div>
      }
  </div>
    )
  }
  
  export default MessageArea