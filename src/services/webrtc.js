import {withRef} from './db';
const db = withRef('/video-session');
 /*
 https://github.com/WebsiteBeaver/simple-webrtc-video-chat-using-firebase
 */
class WebRTC {
    constructor(servers, local_video_id, remote_video_id){
        this.yourId = Math.floor(Math.random()*1000000000);
        this.pc = new RTCPeerConnection(servers);
        this.remote_video_el = document.getElementById(remote_video_id);
        this.local_video_el = document.getElementById(local_video_id);
        this.init();
    }
    
    init = () =>{
        this.pc.onicecandidate = (event => {
            if(event.candidate){
                this.sendMessage(this.yourId, JSON.stringify({'ice': event.candidate}));
            }else{
                console.log("Sent All Ice");
            }
        });
        this.pc.onaddstream = (event => {
            this.remote_video_el.srcObject = event.stream;
        });
    
    }

    sendMessage = (senderId, data) => {
        const msg = db.push({sender: senderId, message: data});
        msg.remove();
    }

    readMessage = (data) => {
        const msg = JSON.parse(data.val().message);
        const sender = data
            .val()
            .sender;
        if (sender != this.yourId) {
            if (msg.ice != undefined) 
                this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
            else if (msg.sdp.type == "offer") 
                this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)).then(() => this.pc.createAnswer()).then(answer => this.pc.setLocalDescription(answer)).then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})));
            else if (msg.sdp.type == "answer") 
                this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            }
        };

        showMyFace = () => {
            navigator
                .mediaDevices
                .getUserMedia({audio: true, video: true})
                .then(stream => this.local_video_el.srcObject = stream)
                .then(stream => this.pc.addStream(stream));
        }

        showFriendsFace = () => {
            this.pc
                .createOffer()
                .then(offer => this.pc.setLocalDescription(offer))
                .then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})));
        }
}

export default WebRTC;


