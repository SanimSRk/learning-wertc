class PeerService{
    constructor(){
        if(!this.perr){

            this.perr=new RTCPeerConnection({
                iceServers: [
                    {
                      urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                      ],
                    },
                  ],
            })
        }
    }

    async getAnswer(offer){
if(this.perr){

    await this.perr.setRemoteDescription(offer)

    const ans=await this.perr.createAnswer()

    await this.perr.setLocalDescription(new RTCSessionDescription(ans))
}

    }

async setLocalDescription(ans){
console.log(ans)
if(this.perr){

    if (ans && (ans.type === 'offer' || ans.type === 'answer')) {
        await this.perr.setRemoteDescription(ans);
    } else {
        console.error("Invalid SDP:", ans);
    }
}

}
    async getOffer(){

        if(this.perr){
            const offer=await this.perr.createOffer()
            await this.perr.setLocalDescription(new RTCSessionDescription(offer))
            return offer
        }
    }
}

export default new PeerService()