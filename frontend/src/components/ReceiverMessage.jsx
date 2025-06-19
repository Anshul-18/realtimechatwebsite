import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { RiAttachment2 } from "react-icons/ri";

function ReceiverMessage({image, message, file}) {
  let scroll=useRef()
  let {selectedUser}=useSelector(state=>state.user)
  useEffect(()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  },[message,image])
  
  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  }

  const parseFileData = () => {
    if (!file) return null;
    try {
        // If it's already JSON parsed, return it
        if (typeof file === 'object') return file;
        
        // Try to parse as JSON
        return JSON.parse(file);
    } catch (error) {
        // If parsing fails, assume it's a direct URL
        return {
            url: file,
            name: 'File',
            type: 'application/octet-stream'
        };
    }
  }

  const fileData = parseFileData();

  return (
    <div className='flex items-start gap-3 mb-4'>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0'>
        <img src={selectedUser.image || dp} alt="" className='w-full h-full object-cover'/>
      </div>
      <div ref={scroll} className='max-w-[80%] bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm'>
        {image && <img src={image} alt="" className='max-w-[200px] rounded-lg mb-2' onLoad={handleImageScroll}/>}
        {message && <p className='text-gray-800'>{message}</p>}
        {fileData && (
          <a 
            href={fileData.url}
            target="_blank"
            rel="noopener noreferrer"
            download={fileData.name}
            className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all mt-2"
          >
            <RiAttachment2 className='w-5 h-5 text-gray-600'/>
            <div className='overflow-hidden'>
              <p className='text-sm font-medium text-gray-800 truncate'>{fileData.name}</p>
              <p className='text-xs text-gray-500'>{fileData.type}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}

export default ReceiverMessage
