const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  "isAdmin": Boolean,
  "name": String,
  "id": String,
  "email": String,
  "password": String,
  "avatar": String
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;