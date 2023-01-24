require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000},
  store: MongoStore.create({
    mongoUrl: process.env.DB_STRING
  })
}));

//Import passport configuration (setting up a verify function and serialize/deserializeUser functions)
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);


app.listen(3000, function(){
  console.log('Server started on port 3000')
});
