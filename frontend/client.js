let socket = io.connect("localhost:8000");
try {
  socket.on("connect", function () {
    document.getElementById("client-id").innerHTML =
      "Client id: " + localStorage.getItem("username");
    if (localStorage.getItem("username")) {
      document.getElementById("login-content").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      // if login hide form and show chat
    }
  });

  socket.on("message-from-server", function (entry) {
    // console.dir(message);
    let messages = document.getElementsByClassName("messages")[0];
    let p = document.createElement("p");
    p.innerText = entry.message;
    messages.appendChild(p);
  });

  socket.on("signup-message", (succes) => {
    if (succes === "OK") {
      alert("Signup successfull");
    } else {
      alert("Signup failed, user already exists!");
    }
  });

  socket.on("login-message", (response) => {
    if (response.succes) {
      localStorage.setItem("username", response.user);
      document.getElementById("login-content").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    } else {
      alert("Wrong username or password");
    }
  });
} catch (err) {
  alert("ERROR: socket.io encountered a problem:\n\n" + err);
}

document.getElementById("send").addEventListener("click", sendMessage);

function sendMessage() {
  let message = document.getElementById("message").value;
  if (!(message === "")) {
    message = localStorage.getItem("username") + ":" + message;
    socket.emit("chat", message);
    document.getElementById("message").value = "";
  }
}

document.getElementById("loginButton").addEventListener("keypress", (evnt) => {
  if (evnt.key == "Enter") {
    evnt.preventDefault();
    document.getElementById("loginButton").click();
  }
});
document.getElementById("loginButton").addEventListener("click", loginBoy);

function loginBoy() {
  // get user (userName and password)
  let form = document.getElementById("form").getElementsByTagName("input");
  let user = {
    username: form.userInput.value,
    password: form.passInput.value,
  };
  // check if user exist
  // get json list and check if user iz there
  socket.emit("login", user);
}

document.getElementById("register").addEventListener("click", register);

function register() {
  // get user from form
  let data = document.getElementById("form").getElementsByTagName("input");
  let username = data.userInput.value;
  let password = data.passInput.value;
  if (username === "") {
    alert("ENTER USERNAME");
  } else if (password === "") {
    alert("ENTER PASSWORD");
  }
  // check if user already in db
  socket.emit("signup", { username: username, password: password });
}

document.getElementById("logout").addEventListener("click", logout);

function logout() {
  console.log("logout");
  // remove storage item so user is log out
  localStorage.removeItem("username");
  location.reload();
}

document
  .getElementById("dark-mode-button")
  .addEventListener("click", enableDarkMode);

function enableDarkMode() {
  let text = document.getElementById("dark-mode-button").innerText;
  if (text === "Dark Mode") {
    document.getElementById("dark-mode-button").innerText = "Light Mode";
    document.body.style.backgroundImage = "url('oi-night.jpg')";
    document.getElementById("title").style.color = "white";
    document.getElementById("client-id").style.color = "white";
    document.getElementById("messages").style.backgroundColor = "#495057";
  } else {
    document.getElementById("dark-mode-button").innerText = "Dark Mode";
    document.body.style.backgroundImage = "url('oi.jpg')";
    document.getElementById("title").style.color = "black";
    document.getElementById("client-id").style.color = "black";
    document.getElementById("messages").style.backgroundColor = "#8EADCC";
  }
}

let input = document.getElementById("message");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send").click();
  }
});
