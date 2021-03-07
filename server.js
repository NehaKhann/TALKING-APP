const express = require("express");
const ejs = require("ejs");
const app = express();
const http = require("http").createServer(app);
const Nexmo = require("nexmo");
const PORT = process.env.PORT || 3000;
require("dotenv").config();


//so that css and js file will work
app.use(express.static(__dirname + "/public"));

// set the view engine to ejs
app.set("view engine", "ejs");

//replace body-parser with this
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Init Nexmo
const nexmo = new Nexmo(
  {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },
  { debug: true }
);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/chat", (req, res) => {
  res.render("chat");
});
app.get("/sms", (req, res) => {
  res.render("sms");
});
app.post("/sms", (req, res) => {
  res.send(req.body);
  console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;
  console.log(number, text);
  nexmo.message.sendSms(
    process.env.NUMBER,
    number,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        //Get data from response
        const data = {
          id:responseData.messages[0]["message-id"],
          number:responseData.messages[0]["to"]
        }
        //Emit to client
        io.emit("smsStatus",data)
      }
    }
  );
});
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//set up for Socket in server
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  console.log("connected");
  io.on("disconnect", () => {
    console.log("Disconnected");
  });

  //Now listen to the event which is coming from client side
  socket.on("message", (msg) => {
    // console.log(msg);
    socket.broadcast.emit("message", msg);
  });
});
