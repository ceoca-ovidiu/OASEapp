const bcrypt = require("bcrypt");
const io = require("socket.io");
var jfile = require("fs");
const server = io.listen(8000);
console.log("Server socket is listening on port 8000");
let connectedClients = new Map();
// event fired every time a new client connects
server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  connectedClients.set(socket.id, socket);
  console.log(connectedClients.size + " client/s connected");

  // when socket disconnects, remove it from the map
  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    console.info(`Client [id=${socket.id}] disconnected`);
    console.log(connectedClients.size + " client/s connected");
  });

  socket.on("chat", (payload) => {
    sendMessageToAllOtherClients(socket, payload);
  });

  socket.on("signup", (payload) => {
    let succes = signup(payload);
    socket.emit("signup-message", succes);
  });

  socket.on("login", (payload) => {
    let succes = login(payload);
    socket.emit("login-message", succes);
  });
});

function sendMessageToAllOtherClients(sender, message) {
  for (let [key, socket] of connectedClients) {
    socket.emit("message-from-server", { id: sender.id, message: message });
  }
}

function signup(message) {
  username = message.username;
  password = message.password;
  exists = false;
  let data = jfile.readFileSync("database.json", "utf-8");
  let users = JSON.parse(data);
  users.forEach((element) => {
    if (element.username === username) {
      exists = true;
    }
  });
  if (!exists) {
    users.push({ username: username, password: bcrypt.hashSync(password, 10) });
    data = JSON.stringify(users);
    jfile.writeFileSync("database.json", data, "utf-8");
    return "OK";
  } else {
    return "Exists";
  }
}

function login(message) {
  username = message.username;
  password = message.password;
  let data = jfile.readFileSync("database.json", "utf-8");
  let users = JSON.parse(data);
  let succes = false;
  users.forEach((element) => {
    if (
      element.username === username &&
      bcrypt.compare(password, element.password)
    ) {
      succes = true;
      return;
    }
  });
  return {
    succes: succes,
    user: username,
  };
}
