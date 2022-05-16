let socket = io.connect('localhost:8000');

try {
  socket.on('connect', function () {
    document.getElementById('client-id').innerHTML = 'Client id: ' + localStorage.getItem('username');
    if (localStorage.getItem('username')) {
      document.getElementById("login-content").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      // if login hide form and show chat
    }
  });

  socket.on('message-from-server', function (entry) {
    // console.dir(message);
    let messages = document.getElementsByClassName('messages')[0];
    let p = document.createElement('p');
    p.innerText = socket.id + ': ' + entry.message;
    messages.appendChild(p);
  });
} catch (err) {
  alert('ERROR: socket.io encountered a problem:\n\n' + err);
}

document.getElementById('send').addEventListener('click', sendMessage);

function sendMessage() {
  let message = document.getElementById('message').value;
  if (!(message === "")) {
    socket.emit('chat', message);
    document.getElementById("message").value = "";
  }
}

document.getElementById('loginButton').addEventListener('click', loginBoy);

function loginBoy() {
  // get user (userName and password)
  let form = document.getElementById('form').getElementsByTagName('input')
  let user = {
    username: form.userInput.value,
    password: form.passInput.value
  }
  // check if user exist
  // get json list and check if user iz there
  fetch('database.json').then(response => {
    response.json().then(res => {
      // res is json users
      res.forEach((el) => {
        if (JSON.stringify(user) === JSON.stringify(el)) {
          // user is there and can login
          socket.emit('user', user.username);
          localStorage.setItem('username', user.username);
        }
      })
    });
  });


}

document.getElementById('register').addEventListener('click', register);

function register() {

  // get user from form
  let username = document.getElementById('form').getElementsByTagName('input').userInput.value;
  if (username === '') {
    alert('INTRODUCE USERNAME');
    return false;
  }
  console.log(username);
  // check if user already in db
  fetch('database.json').then(response => {
    response.json().then(res => {
      let exists = false;
      console.log(res)
      // res is json users
      res.forEach((el) => {
        if (el.username === username) {
          exists = true;
        }
      })
      if (!exists){
        // if user not exist add user to json
      }
    });
  });

}

document.getElementById('logout').addEventListener('click', logout);

function logout() {
  console.log('logout')
  // remove storage item so user is log out
  localStorage.removeItem('username');
  location.reload();
}


document.getElementById('dark-mode-button').addEventListener('click', enableDarkMode);

function enableDarkMode() {
  let text = document.getElementById('dark-mode-button').innerText;
  if (text === 'Dark Mode') {
    document.getElementById('dark-mode-button').innerText = "Light Mode";
    document.body.style.backgroundImage = "url('oi-night.jpg')";
    document.getElementById('title').style.color = 'white';
    document.getElementById('client-id').style.color = 'white';
    document.getElementById('messages').style.backgroundColor = "#495057";
  } else {
    document.getElementById('dark-mode-button').innerText = "Dark Mode";
    document.body.style.backgroundImage = "url('oi.jpg')";
    document.getElementById('title').style.color = 'black';
    document.getElementById('client-id').style.color = 'black';
    document.getElementById('messages').style.backgroundColor = "#8EADCC";
  }
}

let input = document.getElementById("message");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send").click();
  }
});
