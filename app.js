const express = require("express");
app = express();
const mongoose = require("mongoose");
userRoutes = require("./routes/user");
const http = require('http');
const socket = require('socket.io');

const https = http.createServer(app);
const io = socket(https);

io.on("connection", (socket) => {
  console.log("A new client connected");



  socket.on("messageFromFlutter", (message) => {
    console.log(`Message from Flutter: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


try {
  mongoose.connect("mongodb+srv://Bhavin:Bhavin@cluster0.i8oqnoi.mongodb.net/authectication", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then((r) => {

    console.log("connected to db");
  });
} catch (error) {
  console.log(error);
  handleError(error);
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

require("dotenv").config();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.use(userRoutes);

//setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is live on port 8080");
})