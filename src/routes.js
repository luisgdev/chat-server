const express = require('express');
const router = express.Router();
const passport = require('passport');

// routes
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Chat server app' });
});

// The 2nd parameter will verify if user isn't Auth
router.get('/login', isNotAuthenticated, (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/chat',
  failureRedirect: '/login',
  passReqToCallback: true
}));

// The 2nd parameter will verify if user isn't Auth
router.get('/signup', isNotAuthenticated, (req, res, next) => {
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
  res.render('profile');
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

function isNotAuthenticated(req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/chat');
  }
};

module.exports = router;