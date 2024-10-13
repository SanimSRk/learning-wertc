const { Server} = require("socket.io");
const io = new Server(5000,{cors:true});

const emailToSocketIdMap=new Map()
const socketIdToemailIdMap=new Map()
io.on("connection",(socket)=>{
console.log('connection socket io',socket.id)
socket.on('room:join',(data)=>{
    const{email,roomId}=data
    console.log(data)
    emailToSocketIdMap.set(email,socket.id)
    // socketIdToemailIdMap.set(socket.id,email)
    socket.join(roomId)
    io.to(roomId).emit('user:join',{email,id:socket.id})

    io.to(socket.id).emit('room:join',data)
})

socket.on('user:call',({to,offer})=>{
io.to(to).emit("incoming:call",{from:socket.id,offer})
})

socket.on('call:accepted',({to,ans})=>{
    io.to(to).emit("call:accepted",{from:socket.id,ans})

})

socket.on('peer:nego:needed',({to,offer})=>{
io.to(to).emit('peer:nego:needed',{from:socket.id,offer})
})
socket.on('peer:nego:done',({to,ans})=>{
io.to(to).emit('peer:nego:final',{from:socket.id,ans})
})

})
