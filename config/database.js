const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const connection = mongoose.createConnection(process.env.DB_STRING);

const userSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  secret: String
});

userSchema.plugin(findOrCreate);
const User = connection.model('User', userSchema);

module.exports = connection;
