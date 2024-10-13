import { useCallback, useEffect, useState } from "react"
import { useSocket } from "../../AuthProvider/SocketProvider"
import ReactPlayer from 'react-player'
import peer from "../../Service/Peer"
const RoomPage = () => {
const socket=useSocket()
const [remotSocketId,setRemotSocketId]=useState(null)
const [mystream,setmyStream]=useState()
const[ remotStreams,setReamotStream]=useState()

const handileUserjoin=useCallback(({email,id})=>{
console.log('user data for backend', email)
setRemotSocketId(id)

})

const handileCalleUser=useCallback(async()=>{
const stream=await navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true

})
const offer=await peer.getOffer()
socket.emit('user:call',{to:remotSocketId,offer})
setmyStream(stream)
},[remotSocketId,socket])


const handileIncomingCall=useCallback(async({from,offer})=>{
  setRemotSocketId(from)
  const stream=await navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true
})
setmyStream(stream)
console.log('incoming:call',{from,offer})
const ans=await peer.getAnswer(offer)
socket.emit('call:accepted',{to:from,ans})
},[])

const sendStreams=useCallback(()=>{
  for (const track of mystream.getTracks()) {
    // Check if the track is already added by checking peer's senders
    const senders = peer.perr.getSenders();
    const trackExists = senders.some(sender => sender.track === track);

    // If the track isn't added yet, add it
    if (!trackExists) {
      peer.perr.addTrack(track, mystream);
    }
  }


},[mystream,peer.perr])
const handileCallAccepted=useCallback(({from,ans})=>{
  peer.setLocalDescription(ans)
console.log('call accepted')
sendStreams()

},[sendStreams])
const handileNegoNeeded=useCallback(async()=>{
  const offer=await peer.getOffer();
  socket.emit('peer:nego:needed',{offer,to:remotSocketId})
},[socket,remotSocketId])


const handileNegoNeededIncoming=useCallback(async ({from,offer})=>{
const ans=await peer.getAnswer(offer)
socket.emit('peer:nego:done',{to:from,ans})
},[socket])

const handileNegoFinals=useCallback(async({ans})=>{
await peer.setLocalDescription(ans)
},[])
useEffect(()=>{
  peer.perr.addEventListener("negotionneeded",handileNegoNeeded)
  return ()=>{
    peer.perr.removeEventListener("negotionneeded",handileNegoNeeded)
  
  }
},[handileNegoNeeded])
useEffect(()=>{
peer.perr.addEventListener('track',async ev=>{
const remotStream=e.stream
console.log("got tracks")
setReamotStream(remotStream[0])
})

},[])

useEffect(()=>{
socket.on("user:join",handileUserjoin)
socket.on("incoming:call",handileIncomingCall)
socket.on("call:accepted",handileCallAccepted)
socket.on('peer:nego:needed',handileNegoNeededIncoming) 
socket.on('peer:nego:final',handileNegoFinals) 
return()=>{
   socket.off('user:join',handileUserjoin) 
   socket.off('incoming:call',handileIncomingCall) 
   socket.off('call:accepted',handileCallAccepted) 
   socket.off('peer:nego:needed',handileNegoNeededIncoming) 
   socket.off('peer:nego:final',handileNegoFinals) 
}
},[socket,handileUserjoin,handileIncomingCall,handileCallAccepted])
  return (
    <div className="text-center">
    <h2>this is room pages </h2>
    <h2 className="text-center text-xl font-bold">{remotSocketId?'connnected':'No one in room '}</h2>
{
  mystream&&<button className="btn btn-secondary" onClick={sendStreams}>send stream </button>
}
{
    remotSocketId&&<button onClick={handileCalleUser} className="btn btn-primary text-white mt-12">Calle</button>
}

{
    mystream&&<ReactPlayer playing muted height={'300px'} width={'300px'} url={mystream} />
}

{
    remotStreams&&<ReactPlayer playing muted height={'300px'} width={'300px'} url={remotStreams} />
}
    </div>
  )
}

export default RoomPage
