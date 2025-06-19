import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData, toggleDarkMode } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { clearUnreadMessages } from '../redux/unreadMessagesSlice';
import { BsThreeDotsVertical } from "react-icons/bs"; // Add this import

function SideBar() {
    const { userData, otherUsers, selectedUser, onlineUsers, searchData, darkMode } = useSelector(state => state.user)
    const unreadMessages = useSelector(state => state.unreadMessages) // Get from root state
    let [search,setSearch]=useState(false)
    let [input,setInput]=useState("")
    let [showMenu, setShowMenu] = useState(false); // Add this state
    let dispatch=useDispatch()
    let navigate=useNavigate()
    const handleLogOut=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
           
        }
        catch(error){
console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
            handlesearch()
        }

    },[input])

    // Add theme toggle handler
    const handleThemeToggle = () => {
        dispatch(toggleDarkMode());
        if (darkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    // Add useEffect to set initial theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-[#f5f7fb] dark:bg-gray-900 relative ${!selectedUser?"block":"hidden"}`}>
        {/* Replace the fixed buttons with dropdown menu */}
        <div className='fixed bottom-[20px] left-[20px] flex flex-col items-center z-50'>
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-pointer shadow-lg'
            >
                <BsThreeDotsVertical className='w-[25px] h-[25px]'/>
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
                <div className='absolute bottom-[80px] left-0 flex flex-col gap-3 animate-fadeIn'>
                    <button 
                        onClick={handleLogOut}
                        className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-pointer shadow-lg'
                    >
                        <BiLogOutCircle className='w-[25px] h-[25px]'/>
                    </button>
                    <button 
                        onClick={handleThemeToggle}
                        className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-pointer shadow-lg'
                    >
                        {darkMode ? 
                            <MdLightMode className='w-[25px] h-[25px]'/> : 
                            <MdDarkMode className='w-[25px] h-[25px]'/>
                        }
                    </button>
                </div>
            )}
        </div>

        <div className='w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] dark:from-gray-800 dark:to-gray-700 rounded-b-[10px] px-6 py-4'>
            <h1 className='text-white font-bold text-[25px]'>Chatify</h1>
            <div className='flex items-center justify-between'>
                <h1 className='text-white font-medium text-xl'>
                    Welcome {userData.name || `You (${userData.userName})`}
                </h1>
                <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-white/10 hover:bg-white/20 transition-colors cursor-pointer' 
                    onClick={()=>navigate("/profile")}>
                    <img src={userData.image || dp} alt="" className='w-full h-full object-cover'/>
                </div>
            </div>
           <div className='w-full  flex items-center gap-[20px] overflow-y-auto py-[18px]'>
            {!search && <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 cursor-pointer shadow-lg' onClick={()=>setSearch(true)}>
           <IoIosSearch className='w-[25px] h-[25px]'/>
        </div>}

        {search && 
            <form className='w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative'>
            <IoIosSearch className='w-[25px] h-[25px]'/>
            <input type="text" placeholder='search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-0' 
                onChange={(e)=>setInput(e.target.value)} 
                value={input}
            />
            <RxCross2 className='w-[25px] h-[25px] cursor-pointer' onClick={()=>{
                setSearch(false)
                setInput("")
                dispatch(setSearchData(null))
            }}/>
            </form>
        }

        {/* Add search results display */}
        {searchData && searchData.length > 0 && search && (
            <div className='absolute top-[250px] left-0 w-full bg-white shadow-lg z-50 max-h-[400px] overflow-y-auto'>
                {searchData.map((user) => (
                    <div key={user._id} 
                        className='flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b'
                        onClick={() => {
                            dispatch(setSelectedUser(user))
                            setSearch(false)
                            setInput("")
                            dispatch(setSearchData(null))
                        }}>
                        <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                            <img src={user.image || dp} alt="" className='w-full h-full object-cover'/>
                        </div>
                        <div>
                            <h3 className='font-medium text-gray-800'>{user.name || user.userName}</h3>
                            <p className='text-sm text-gray-500'>{onlineUsers?.includes(user._id) ? "Online" : "Offline"}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {!search && otherUsers?.map((user)=>(
            onlineUsers?.includes(user._id) && (
                <div key={user._id} className='relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px] cursor-pointer' 
                    onClick={()=>dispatch(setSelectedUser(user))}>
        <div className='w-[60px] h-[60px]   rounded-full overflow-hidden flex justify-center items-center '>
        <img src={user.image || dp} alt="" className='h-[100%]'/>
        </div>
        <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>
        </div>
        )
    ))}
     
       </div>
          </div>

          {/* Update user cards styling */}
          <div className='w-full h-[calc(100vh-250px)] overflow-auto flex flex-col gap-3 items-center mt-4 p-4'>
    {otherUsers?.map((user) => (
        <div key={user._id} 
            className='w-[95%] h-[80px] flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-[#e0e7ff] dark:hover:bg-gray-700 transition-all duration-200 px-6 cursor-pointer rounded-2xl shadow-sm' 
            onClick={() => {
                dispatch(setSelectedUser(user))
                dispatch(clearUnreadMessages({ userId: user._id }))
            }}>
            <div className='flex items-center gap-4'>
                <div className='relative'>
                    <div className='w-[55px] h-[55px] rounded-full overflow-hidden'>
                        <img src={user.image || dp} alt="" className='h-full w-full object-cover'/>
                    </div>
                    {onlineUsers?.includes(user._id) &&
                        <span className='w-3 h-3 rounded-full absolute bottom-0.5 right-0.5 bg-[#22c55e] border-2 border-white'></span>
                    }
                </div>
                <div className='flex flex-col justify-center'>
                    <h1 className='text-gray-800 dark:text-white font-semibold text-lg flex items-center gap-2'>
                        {user.name || user.userName || "You"}
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            {unreadMessages[user._id] > 0 && (
                <div className='bg-[#22c55e] text-white px-2.5 py-1 rounded-full text-sm font-medium min-w-[24px] text-center'>
                    {unreadMessages[user._id]}
                </div>
            )}
        </div>
    ))}
          </div>
      </div>
  )
}

export default SideBar