require('dotenv').config();
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local');
const timingSafeCompare = require('tsscmp');
const connection = require('./database');
const User = connection.models.User;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');



function verify(username, password, cb){
  User.findOne({username: username}, function(err, user){
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    const inputHash = crypto.pbkdf2Sync(password, user.salt, parseInt(process.env.ITER), parseInt(process.env.KEYLEN), 'sha256').toString('hex');
    if(timingSafeCompare(inputHash, user.hash)) {
      return cb(null, user);
    }else{
      return cb(null, false, { message: 'Incorrect username or password.' });
    }
  });
};


passport.use(new LocalStrategy(verify));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GKLIENT_ID,
    clientSecret: process.env.GKLIENT_KEY,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
