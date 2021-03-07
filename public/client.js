const socket = io();

//Message Sending Logic
//give the prompt until and unless you give the name
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
do {
  name = prompt("Please Enter your name: ");
} while (!name);
//if press enter
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});
//sending the user name as well
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim()
  };
  //Append
  appendMessage(msg, "outgoing");
  textarea.value=""
  scrollBottom()
  //Sending Message to server via socket
  socket.emit("message", msg);
  
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  let markup = `
  <h4>${msg.user}</h4>
  <p>${msg.message}</p> 
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}
//receiving the message now
//check the client console means in browser
socket.on("message", (msg) => {
  appendMessage(msg,"incoming")
  scrollBottom()
});

//for automatically scrolling
function scrollBottom(){
    messageArea.scrollTop= messageArea.scrollHeight
  }
