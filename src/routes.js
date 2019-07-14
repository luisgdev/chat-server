const express = require('express');
const router = express.Router();
const passport = require('passport');

// Users database (TEMP)
const users = [
  {
    username: "admin",
    password: "admin321",
    status: "offline"
  },
  {
    username: "luisg",
    password: "luisg123",
    status: "offline"
  }
];

// routes
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Chat server app' });
});

// Routes below this block will only be shown to noAuth users
/*router.use((req, res, next) => {
  isNotAuthenticated(req, res, next);
  next();
});*/

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/chat',
  failureRedirect: '/login',
  passReqToCallback: true
}));

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/chat',
  failureRedirect: '/signup',
  passReqToCallback: true
}));

// Routes below this block will need auth
router.use((req, res, next) => {
  isAuthenticated(req, res, next);
  next();
});

router.get('/chat', (req, res, next) => {
  res.render('chat');
});

router.get('/profile', (req, res, next) => {
  res.send('Profile');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
})

// Middlewares
function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login');
  }
};

/*function isNotAuthenticated(req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/chat');
  }
};*/

module.exports = router;