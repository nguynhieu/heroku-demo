const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  "name": String,
  "userId": String,
  "book": String,
  "bookId": String,
  "id": String,
  "isComplete": Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;