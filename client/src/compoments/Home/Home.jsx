import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../AuthProvider/SocketProvider'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigation=useNavigate()
  const socket=useSocket()

const handileClikJoin=(e)=>{
e.preventDefault()
const email=e.target.email.value
const roomid=e.target.rome.value
socket.emit('room:join',{email,roomid})
    }
const handileJoinRoom=useCallback((data)=>{
const {email,roomid}=data
navigation(`/room/${roomid}`)
console.log(email,roomid)
},[navigation])

 useEffect(()=>{

socket.on('room:join',handileJoinRoom)

return ()=>{
  return socket.off('room:join',handileJoinRoom)
}
    },[socket,handileJoinRoom])
  return (
   <div className="hero w-full bg-base-200 min-h-screen">
  <div className="hero-content w-full flex-col lg:flex-row-reverse">
    <div className="card bg-base-100 w-full lg:w-1/3 shrink-0 shadow-2xl">
      <form onSubmit={handileClikJoin} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="email" name='email' className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rome id</span>
          </label>
          <input type="number" placeholder="Rome Id" name='rome' className="input input-bordered" required />
        </div>
        <div className="form-control mt-6">
          <button type='submit' className="btn btn-primary">Join Now</button>
        </div>
      </form>
    </div>
  </div>
</div>
  )
}

export default Home
