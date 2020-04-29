const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
  "title": String,
  "desciption": String,
  "id": String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;