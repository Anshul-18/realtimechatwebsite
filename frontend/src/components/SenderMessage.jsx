import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { RiAttachment2 } from "react-icons/ri";
function SenderMessage({image, message, file}) {
  let scroll = useRef()
  let {userData}=useSelector(state=>state.user)
  useEffect(()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  },[message,image])
  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  }
  const parseFileData = () => {
    if (!file) return null;
    try {
      return typeof file === 'string' ? JSON.parse(file) : file;
    } catch (error) {
      console.error("Error parsing file data:", error);
      return null;
    }
  }

  const fileData = parseFileData();

  return (
    <div className='flex items-start gap-3 mb-4 flex-row-reverse'>
    <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0'>
        <img src={userData.image || dp} alt="" className='w-full h-full object-cover'/>
    </div>
    <div ref={scroll} className='max-w-[80%] bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white rounded-2xl rounded-tr-none px-4 py-2'>
        {image && <img src={image} alt="" className='max-w-[200px] rounded-lg mb-2'/>}
        {message && <p>{message}</p>}
        {fileData && (
          <a 
            href={fileData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all mt-2"
          >
            <RiAttachment2 className='w-5 h-5'/>
            <div>
                <p className='text-sm font-medium'>{fileData.name}</p>
                <p className='text-xs opacity-75'>{fileData.type}</p>
            </div>
          </a>
        )}
    </div>
</div>
  )
}

export default SenderMessage
