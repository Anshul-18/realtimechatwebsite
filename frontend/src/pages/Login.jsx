import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
    let navigate=useNavigate()
    let [show,setShow]=useState(false)
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [loading,setLoading]=useState(false)
    let [err,setErr]=useState("")
    let dispatch=useDispatch()
    
        const handleLogin=async (e)=>{
            e.preventDefault()
            setLoading(true)
            try {
                let result =await axios.post(`${serverUrl}/api/auth/login`,{
    email,password
                },{withCredentials:true})
               dispatch(setUserData(result.data))
               dispatch(setSelectedUser(null))
               navigate("/")
                setEmail("")
                setPassword("")
                setLoading(false)
                setErr("")
            } catch (error) {
                console.log(error)
                setLoading(false)
                setErr(error.response.data.message)
            }
        }
    
return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col'>
            <div
                className='w-full h-[100%] bg-gradient-to-r from-[#6366f1] to-[#4f46e5] shadow-lg flex flex-col items-center pt-[50px] gap-8'
                style={{
                    borderTopLeftRadius: '30%',
                    borderBottomRightRadius: '30%',
                }}
            >
                <h1 className='text-gray-200 font-bold text-[30px] pt-12'>Login to <span className='text-white'>Chatify</span></h1>
                
                <form className='w-full flex flex-col gap-[20px] items-center pt-10' onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder='email' 
                        className='w-[90%] h-[50px] outline-none border-2 border-white/20 px-[20px] py-[10px] bg-white/10 rounded-lg text-white placeholder:text-white/70 text-[19px]' 
                        onChange={(e)=>setEmail(e.target.value)} 
                        value={email}
                    />
                    <div className='w-[90%] h-[50px] border-2 border-white/20 overflow-hidden rounded-lg relative bg-white/10'>
                        <input 
                            type={`${show?"text":"password"}`} 
                            placeholder='password' 
                            className='w-full h-full outline-none px-[20px] py-[10px] bg-transparent text-white placeholder:text-white/70 text-[19px]' 
                            onChange={(e)=>setPassword(e.target.value)} 
                            value={password}
                        />
                        <span className='absolute top-[10px] right-[20px] text-[19px] text-white/70 font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>
                            {`${show?"hidden":"show"}`}
                        </span>
                    </div>
                    {err && <p className='text-red-400'>{"*" + err}</p>}
                    <button className='px-[20px] py-[10px] bg-white text-[#4f46e5] rounded-2xl text-[18px] font-semibold hover:bg-gray-100 transition-colors' disabled={loading}>
                        {loading?"Loading...":"Login"}
                    </button>
                </form>
                
                <p className='text-white/70 cursor-pointer hover:text-white' onClick={()=>navigate("/signup")}>
                    Want to create a new account? <span className='font-semibold'>sign up</span>
                </p>
            </div>
        </div>
    </div>
)
}

export default Login
