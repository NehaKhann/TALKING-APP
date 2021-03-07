const socket = io();
const numberInput = document.getElementById("number");
textInput = document.getElementById("msg");
button = document.getElementById("button");
response = document.querySelector(".response");

button.addEventListener("click", send, false);
socket.on("smsStatus", function (data) {
  response.innerHTML = `<h5>Text Message has been sent to ${data.number}</h5>`;
});

//we replace all non numeric characters
function send() {
  const number = numberInput.value.replace(/\D/g, "");
  const text = textInput.value;

  //we are now making post request to server
  fetch("/sms", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ number: number, text: text }),
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
