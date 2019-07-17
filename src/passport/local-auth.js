const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Save a session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Delete a session
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Sign up process
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email: email });
    if (user) {
        return done(null, false, req.flash('signupMessage', 'Email already taken.'));
    } else {
        // Then we can save additional information like 'username'
        const newUser = new User();
        newUser.email = email;
        newUser.username = req.body.username; // We get this parameter from the request
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

// Login process
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, req.flash('signinMessage', 'User not foud!'));
    }else if (!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'Incorrect password!'));
    }else{
        done(null, user);
    }
}));