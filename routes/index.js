const router = require('express').Router();
const connection = require('../config/database');
const User = connection.models.User;
const genPassword = require('../lib/passportUtils').genPassword;
const isAuth = require('../lib/auth').isAuth;
const passport = require('passport');



//Get requests handlers
router.get('/', (req, res) => {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/submit', isAuth, (req, res) => {
  res.render('submit');
});

router.get('/secrets', isAuth, (req, res) => {
  User.find({'secret': {$ne: null}}, function(err, usersWithSecrets){
    if (err){
      console.log(err);
    }else{
      if(usersWithSecrets){
        res.render('secrets', {usersWithSecrets: usersWithSecrets});
      }else{
        console.log('There is no users with secrets.');
        res.render('secrets');
      }
    }
  });

});

router.get('/logout', (req, res) => {
  req.logout(function(err){
    if (err){
      return next(err);
    }else{
      res.redirect('/');
    }
  });
});

//Post requests handlers
router.post('/register', (req, res) => {
  const hashSalt = genPassword(req.body.password);
  const newUser = new User({
    username: req.body.username,
    hash: hashSalt.hash,
    salt: hashSalt.salt
  });
  newUser.save();
  res.redirect('/login');
});

router.post('/login', passport.authenticate('local', {successRedirect: '/secrets', failureRedirect: '/login'}), (req, res) => {});

router.post('/submit', isAuth, (req, res) => {
  User.findById(req.user.id, function(err, user){
    if (err){
      console.log(err);
    }else{
      if(user){
        user.secret = req.body.secret;
        user.save(function(){
          res.redirect('/secrets');
        });
      }
    }
  });
});

module.exports = router;
