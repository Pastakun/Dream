const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const chatdata = [];
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/getchat', (req, res) => {
  res.send(chatdata);
});

io.on('connection', (socket) => {
  console.log('connect');

  socket.on('send', (json) => {
    chatdata.push(json);
    if (chatdata.length > 200) {
      chatdata.shift();
    }

    io.emit('message', json);
  });

  socket.on('livesend', (json) => {
    io.emit('livemessage', json);
  });

  socket.on('socket', (json) => {
    io.emit('socket', json);
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
console.log('test');
