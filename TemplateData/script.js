(async function main() {
  const joinTrigger = document.getElementById('make-call');
  const leaveTrigger = document.getElementById('end-call');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('roomId');
  const skywayKey = document.getElementById('key');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  const toggleMicrophone = document.getElementById('js-toggle-microphone');
  let joinCount = document.getElementById('joinCount');

  let localStream = null;
  let existingCall = null;

  const getRoomModeByHash = 'sfu';

  let audioSelect = $('#audioSource');
  
  let audios = "";
  
  let setButton = document.getElementById('voiceChatSet');
  

  localStream = await navigator.mediaDevices
    .getUserMedia({
      video: false,
      audio: {
          echoCancellation: true,
          noiseSuppression: true
      }
    })
    .catch(console.error);

  // マイクデバイス選択の要素を設定
  navigator.mediaDevices.enumerateDevices()
      .then(function(deviceInfos) {
          for (let i = 0; i !== deviceInfos.length; ++i) {
              let deviceInfo = deviceInfos[i];
              let option = $('<option>');
              option.val(deviceInfo.deviceId);
              if (deviceInfo.kind === 'audioinput') {
                  option.text(deviceInfo.label);
                  audioSelect.append(option);
                  
                  if(audios === ""){
                      audios = audios + deviceInfo.label + '/' + deviceInfo.deviceId;
                  } else {
                      audios = audios + ',' + deviceInfo.label + '/' + deviceInfo.deviceId;
                  }
              } 
          }
          
          console.log(audios);
          
          document.getElementById('audioInputText').value = audios;
          
          audioSelect.on('change', setupGetUserMedia);
          setupGetUserMedia();
  
      }).catch(function (error) {
          console.error('mediaDevices.enumerateDevices() error:', error);
          alert("オーディオ情報の取得に失敗しました。\nマイクアクセスを許可し、ページを更新してください。");
          return;
      });



setButton.addEventListener('click', 
function setVoiceChat()
{
  let apiKey = skywayKey.value;
    
  // eslint-disable-next-line require-atomic-updates
  const peer = (window.peer = new Peer({
    key: apiKey,
    debug: 3,
  }));

  // Register join handler
  joinTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }
    
    let roomName = roomId.value;
    
    console.log(roomName);

    const room = peer.joinRoom(roomName, {
      mode: getRoomModeByHash,
      stream: localStream
    });
    setupCallEventHandlers(room);

    room.once('open', () => {
      messages.textContent += '=== You joined ===\n';
    });
    room.on('peerJoin', peerId => {
      messages.textContent += `=== ${peerId} joined ===\n`;
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      joinCount.setAttribute('value', String(joinCount.valueAsNumber + 1));
      
      unitySendJoinCount();
      
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });

    room.on('data', ({ data, src }) => {
      // Show a message sent to the room and who sent
      messages.textContent += `${src}: ${data}\n`;
    });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

      joinCount.setAttribute('value', String(joinCount.valueAsNumber - 1));
      
      unitySendJoinCount();
      
      messages.textContent += `=== ${peerId} left ===\n`;
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== You left ===\n';
      
      joinCount.setAttribute('value', String(1));
      
      unitySendJoinCount();

      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    sendTrigger.addEventListener('click', onClickSend);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });

    function onClickSend() {
      // Send message to all of the peers in the room via websocket
      room.send(localText.value);

      messages.textContent += `${peer.id}: ${localText.value}\n`;
      localText.value = '';
    }
  });
  
  // マイクミュートボタン
  toggleMicrophone.addEventListener('click', () => {
  const audioTracks = localStream.getAudioTracks()[0];
  audioTracks.enabled = !audioTracks.enabled;
  //microphoneStatus.textContent = `${audioTracks.enabled ? 'ON' : 'OFF'}`;
  });

  peer.on('error', console.error);
});

 function setupGetUserMedia() {
  let audioSource = $('#audioSource').val();
  let constraints = {
      audio: {deviceId: {exact: audioSource}},
      video: false
  };
  

  if(localStream){
      localStream = null;
  }

   navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
          localStream = stream;

          if(existingCall){
              existingCall.replaceStream(stream);
          }
      }).catch(function (error) {
      console.error('mediaDevice.getUserMedia() error:', error);
      alert("オーディオ情報の取得に失敗しました。\nマイクアクセスを許可し、ページを更新してください。");
      return;
  });
}  

    function setupCallEventHandlers(call){
        if (existingCall) {
            existingCall.close();
        }

        existingCall = call;

    }
  
  
})();


