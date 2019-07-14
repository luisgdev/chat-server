const path = require('path');
const morgan = require('morgan');
const engine = require('ejs-mate');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Init
const app = express();
require('./database');
require('./passport/local-auth');

// Settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'mysession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.signinMessage = req.flash('signinMessage');
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes'));

// Running server
const server = app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});

// Socket Settings
const socketIO = require('socket.io');
const io = socketIO(server);

// Websockets
io.on('connection', (socket) => {
  // Log when a user is connected
  console.log('socketIO: User just connected:', socket.id);

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
    console.log('socketIO: User disconnected:', username.id);
  });
});
