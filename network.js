document.addEventListener('DOMContentLoaded', function(){
  var sendMsgButton = document.getElementById('sendMsgButton');
  sendMsgButton.addEventListener('click', function() {
    sendMsg();
  });
});

function onReceive(info){
  console.log(ab2str(info.data));
  document.getElementById("reply").innerHTML = ab2str(info.data);
}

// Taken from http://stackoverflow.com/a/11058858
function ab2str(buf){
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}


// Taken from http://stackoverflow.com/a/29576879
function stringToArrayBuffer(string){
  var arrayBuffer = new ArrayBuffer(string.length * 2);
  var buffer = new Uint16Array(arrayBuffer);
  //var stringLength = string.length;
  for(var i = 0; i < string.length; i++){
    buffer[i] = string.charCodeAt(i);
  }

  return arrayBuffer;
}

function sendMsg(){
  chrome.sockets.udp.create({}, function(socketInfo){
    var socketId = socketInfo.socketId;	
    var myData = stringToArrayBuffer(document.getElementById('message').value);

    chrome.sockets.udp.onReceive.addListener(onReceive);

    chrome.sockets.udp.bind(socketInfo.socketId, '127.0.0.1', 0, function(retStatus) {
      chrome.sockets.udp.send(socketId, myData, '127.0.0.1', 8088, function(sendInfo) {
        console.log("sent " + sendInfo.bytesSent);
      });
    });
  });
}

