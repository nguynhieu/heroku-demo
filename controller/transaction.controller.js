const shortid = require('shortid');

const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');

let isAdmin;
let admin;

module.exports.index = async (req, res) => {
  let userId= req.cookies.userId || undefined;
  let transactions = await Transaction.find();
  
  if (userId) {
    isAdmin = await User
      .findOne({ id: userId })
    admin = isAdmin.get('isAdmin');
  } else {
    admin = false;
  };

  res.render("transaction/index", {
    transactions: await Transaction.find()
  });
  
  // if (admin) {
  //   res.render("transaction/index", {
  //     transactions: await Transaction.find()
  //   });
  // } else {
  //   res.render("transaction/index", {
  //     transactions: transactions
  //       .filter(item => {
  //         return item.userId === userId
  //       })
  //   });
  // }
}

module.exports.create = async (req, res) => {
  if (admin) {
    let books = await Book.find();
    res.render("transaction/create", {
      books: books
    });
    return;
  }
  res.send("You must be an admin");
}

module.exports.postCreate = async (req, res) => {
  let book = await Book
    .findOne({ title: req.body.book });
  
  let newBorrower = {
    name: req.body.name,
    userId: req.cookies.userId,
    book: book.title,
    bookId: book.id,
    id: shortid.generate(),
    isComplete: false
  };
  
  await Transaction
    .insertMany(newBorrower)
  
  res.redirect("/transactions");
}