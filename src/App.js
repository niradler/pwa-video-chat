import React, {Component} from 'react';
import WebRTC from './services/webrtc';
import db from './services/db';
import {servers} from './config';
// const db = withRef('/video-session');
class App extends Component {
  componentDidMount(){
    
    const webrtc = new WebRTC(servers,'yourVideo','friendsVideo')
    db.on('child_added', webrtc.readMessage);
    webrtc.showMyFace()
    this.webrtc = webrtc;
  }

  render() {
    return (
      <div className="App">

        <div className="container">
      
          <div className="tile is-ancestor">
            <div className="tile is-parent">
            <video id="yourVideo" autoPlay muted playsInline></video>
            </div>
            <div className="tile is-parent">
            <video id="friendsVideo" autoPlay playsInline></video>
            </div>
          </div>

        <div>
          <button className="button" onClick={()=>  this.webrtc.showFriendsFace()}>Join Call</button>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
