var localVideo;
var remoteVideo;
var peerConnection;
var uuid;
var localStream =null;
var sender=false;


// stan server config
var peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
};



// Initialize page config
function pageReady() {
    uuid = uuid();

    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');

    serverConnection = new WebSocket('wss://' + window.location.hostname + ':16443');
    
    serverConnection.onmessage = gotMessageFromServer;

     console.log("page initiation done");
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.onaddstream = gotRemoteStream;




}



//  successfully received user media
function getUserMediaSuccess(stream) {

    if(localStream!=null)
         peerConnection.removeStream(localStream);

    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);  


      var constraintsAUdio = {
            audio: true
        };


      navigator.mediaDevices.getUserMedia(constraintsAUdio).then(function (audioStream){
        console.log("adding audion track")

        var audioTrack = audioStream.getAudioTracks()[0];

        localStream.addTrack(audioTrack);


        peerConnection.addStream(localStream);


      var offerOptions = {
            iceRestart: true,
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };


    peerConnection.createOffer(offerOptions).then(createdDescription).catch(errorHandler);

      
      }).catch(errorHandler);


}


function start(isCaller) {
    console.log("start caller");

    if(isCaller) { 
        sender=true;
        console.log("1st caller");
        getChromeExtensionStatus();
    }else{

        getWebcam();
    }
}




// handel messages from server
function gotMessageFromServer(message) {

    console.log("got message from server");
    if(!peerConnection) start(false);
    console.log("Received message from server");
    console.log(message.data);

    var signal = JSON.parse(message.data);
    // Ignore messages from ourself
    if(signal.uuid == uuid) return;

    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {

            
            // Only create answers in response to offers
            if(signal.sdp.type == 'offer'  )  {
                console.log("creating answer to offer");
                peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
                if(!sender){
                    console.log("Not sender going to share screen ");
                    
                }
            }
        }).catch(errorHandler);
    } else if(signal.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
    }
}



function gotIceCandidate(event) {
    console.log("got icecandidate from server");
    if(event.candidate != null) {
        serverConnection.send(JSON.stringify({'ice': event.candidate, 'uuid': uuid}));
    }
}

function createdDescription(description) {
    console.log('got description '+description);

    peerConnection.setLocalDescription(description).then(function() {
        serverConnection.send(JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
    }).catch(errorHandler);
}

function gotRemoteStream(event) {
    alert("got video stream");
    console.log('got remote stream');

    remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function errorHandler(error) {
    console.log(error);
    alert("An error has occured")
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}









window.addEventListener('message', function(event) {
    if (event.origin != window.location.origin) {
        return;
    }
    onMessageCallback(event.data);
});

// and the function that handles received messages


// global variables
var chromeMediaSource = 'screen';
var sourceId;
var screenCallback;

var dc;



var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;




// handles the share and cancel event
function onMessageCallback(data) {
  console.log(data);
    // "cancel" button is clicked
    if (data == 'PermissionDeniedError') {
        chromeMediaSource = 'PermissionDeniedError';
        if (screenCallback) return screenCallback('PermissionDeniedError');
        else throw new Error('PermissionDeniedError');
    }

    // extension notified his presence
    if (data == 'rtcmulticonnection-extension-loaded') {
        chromeMediaSource = 'desktop';
    }

    // extension shared temp sourceId
    if (data.sourceId && screenCallback) {
        screenCallback(sourceId = data.sourceId);
    }
}

// if you want to check if chrome extension is installed and enabled
 /*  isChromeExtensionAvailable(function(isAvailable) {
         if(!isAvailable) alert('Chrome extension is either not installed or disabled.');
   });
*/
// instead of using "isChromeExtensionAvailable", you can use
// a little bit more reliable method: "getChromeExtensionStatus"

function onPluginStatus(status) {

       if(status == 'installed-enabled') {
           console.log("Installed and enabled calling get source Id");
           getSourceId(processScreenshareRequest);
      }

      if(status == 'installed-disabled') {
         console.log("Installed and disabled");
      }

      if(status == 'not-installed') {
         
         console.log("Not Installed");
         alert("please install  chrome plugin");
      }

      if(status == 'not-chrome') {
           alert("Not chrome");
       }
}


function  processScreenshareRequest(sourceId) {
    if(sourceId != 'PermissionDeniedError') {
        console.log("permission given");
        console.log(sourceId);
         var constraints = {
            video: {
                mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sourceId,
                maxWidth: 400,
                maxHeight: 400,
                minAspectRatio: 1.77
                }
            }
        };

        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
        } else {
            alert('Your browser does not support getUserMedia API');
        }
     }
   };


function  getWebcam() {


        console.log("permission given");
        console.log(sourceId);
         var constraints = {
            video: {
                mandatory: {
                maxWidth: 400,
                maxHeight: 400,
                minAspectRatio: 1.77
                }
            }
        };

        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
        } else {
            alert('Your browser does not support getUserMedia API');
        }
     
   };


function getChromeExtensionStatus( callback) {
    if (isFirefox) return callback('not-chrome');

    if (arguments.length != 2) {
        callback = onPluginStatus;
        extensionid = 'oakipigconcippgnlkpkapfhedccjljp'; // default extension-id
    }

    var image = document.createElement('img');
    image.src = 'chrome-extension://' + extensionid + '/icon.png';
    image.onload = function() {
        chromeMediaSource = 'screen';
        window.postMessage('are-you-there', '*');
        setTimeout(function() {
            if (chromeMediaSource == 'screen') {
                callback(extensionid == extensionid ? 'installed-enabled' : 'installed-disabled');
            } else callback('installed-enabled');
        }, 2000);
    };
    image.onerror = function() {
        callback('not-installed');
    };
}


// retrives SoruceId from plugin
function getSourceId(callback) {
    if (!callback) 
        throw '"callback" parameter is mandatory.';
    if(sourceId) 
        return callback(sourceId);    
    
    screenCallback = callback;
    window.postMessage('get-sourceId', '*');
}




// initiate call with id 