var socket = io.connect('localhost:8000');

try {
  socket.on('connect', function () {
    document.getElementById('client-id').innerHTML = 'Client id: ' + socket.id;
  });

  socket.on('message-from-server', function (entry) {
    // console.dir(message);
    var messages = document.getElementsByClassName('messages')[0];
    let p = document.createElement('p');
    p.innerText = entry.id + ': ' + entry.message;
    messages.appendChild(p);
  });
} catch (err) {
  alert('ERROR: socket.io encountered a problem:\n\n' + err);
}

document.getElementById('send').addEventListener('click', sendMessage);
function sendMessage() {
  var message = document.getElementById('message').value;
  if (!(message === "")){
    socket.emit('chat', message);
    document.getElementById("message").value = "";
  }
}

document.getElementById('dark-mode-button').addEventListener('click', enableDarkMode);
function enableDarkMode() {
  var text =  document.getElementById('dark-mode-button').innerText;
  if(text === 'Dark Mode'){
    document.getElementById('dark-mode-button').innerText = "Light Mode";
    document.body.style.backgroundImage= "url('oi-night.jpg')";
    document.getElementById('title').style.color = 'white';
    document.getElementById('client-id').style.color = 'white';
    document.getElementById('messages').style.backgroundColor = "#495057";
  }else{
    document.getElementById('dark-mode-button').innerText = "Dark Mode";
    document.body.style.backgroundImage= "url('oi.jpg')";
    document.getElementById('title').style.color = 'black';
    document.getElementById('client-id').style.color = 'black';
    document.getElementById('messages').style.backgroundColor = "#8EADCC";
  }
}

var input = document.getElementById("message");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send").click();
  }
});