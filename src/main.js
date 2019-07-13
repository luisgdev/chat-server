const path = require('path');
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Running server
const server = app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});

// Socket Settings
const socketIO = require('socket.io');
const io = socketIO(server);

let users = {};

// Websockets
io.on('connection', (socket) => {
  // Log when a user is connected
  console.log('User just connected:', socket.id);

  // Listen user messages and send it to 'chatroom'
  socket.on('chatroom', (data) => {
    io.sockets.emit('chatroom', data);
  });

  // Listen user typing
  socket.on('user:typing', (username) => {
    socket.broadcast.emit('user:typing', username);
  });

  // User disconnect
  socket.on('disconnect', (username) => {
    console.log('User disconnected:', username.id);
  });
});
