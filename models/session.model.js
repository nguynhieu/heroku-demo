const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  "id": String,
  "wrongLoginCount": Number,
  "cart": [],
  "transaction": []
});

const Session = mongoose.model('Session', sessionSchema, 'sessionId');

module.exports = Session;