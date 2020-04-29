const shortid = require('shortid');

const Book = require('../models/book.model');
const Session = require('../models/session.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

let isAdmin;
let admin;

module.exports.index = async (req, res, next) => {
  let session = req.signedCookies.sessionId;
  
  let sessionId = await Session.findOne({ id: session })

  let bookInCart = sessionId.cart;
  
  let totalBookInCart = bookInCart.reduce((sum, obj) => {
      return sum + obj.quantity; 
  }, 0);
  
  let userId= req.cookies.userId || undefined;
  
  if (userId) {
    isAdmin = await User
      .findOne({ id: userId })
    admin = isAdmin.get('isAdmin');
  } else {
    admin = false;
  };
  
  let books = await Book.find();
  try {
    let a;
    a.b();

    res.render("books", {
      totalBookInCart: totalBookInCart, 
      isAdmin: admin,
      books: books
    })
  } catch (error) {
    next(error)
  }
    
};

// Add book to cart
module.exports.addToCart = async (req, res) => {
  let session = req.signedCookies.sessionId;
  let bookId = req.params.id;
  let count;
  
  let book = await Book
    .findOne({ id: req.params.id })
    
  let user = await User
    .findOne({ id: req.cookies.userId })
  
  let sessionId = await Session
    .findOne({ id: session })
  
  let bookObj = sessionId.cart
    .filter(book => {
      return book.book === bookId;
    });
  
  if (bookObj[0]) {
    count = bookObj[0].quantity ? 
      bookObj[0].quantity : 0;
  } else count = 0;
  
  if (count) {
    let purchasedBook = sessionId.cart.find((item) => {
      return item.book === bookId
    });
    
    purchasedBook.quantity += 1;
    sessionId.markModified('cart');
    sessionId.save();
    
  } else await Session.findOneAndUpdate(
      { id: session },
      { $push: 
         {
           cart: {
             book: bookId,
             quantity: count + 1
           }
         } 
      }
    )
    
  // PUSH transaction for session
  if (!user) {
    await Session.findOneAndUpdate(
      { id: session },
      {
        $push: {
          transaction: {
            book: book.title,
            bookId: book.id,
            id: shortid.generate(),
            isComplete: false    
          }
        }
      })
  } else {
      await Session.findOneAndUpdate(
        { id: session },
        { 
          $push: {
            transaction: {
              name: user.name,
              userId: user.id,
              book: book.title,
              bookId: book.id,
              id: shortid.generate(),
              isComplete: false  
            }
          }
      })
  };
  
  console.log(await Session
    .findOne({ id: session }));
    
  res.redirect('/books');
};

// Create a new Book Page
module.exports.create = (req, res) => {
  if (admin) {
    res.render("create");
    return;
  }
  res.send("You must be an admin");
};


// Post Create a new Book Page
module.exports.postCreate = async (req, res) => {
  let book = {
    title: req.body.title,
    desciption: req.body.description,
    id: shortid.generate()
  }
  
  console.log(book);
  
  await Book.insertMany(book);
  
  res.redirect("/books");
};

module.exports.update = (req, res) => {
  if (admin) {
    res.render('update', {
      id: req.params.id
    });
    return;
  }
  res.send("You must be an admin");
};

module.exports.postUpdate = async (req, res) => {
  await Book.findOneAndUpdate(
    { id: req.params.id },
    { title: req.body.title }
  )

  res.redirect("/books");
};

module.exports.delete = async (req, res) => {
  if (admin) {
    await Book.findOneAndRemove(
      { id: req.params.id }
    )
  
    res.redirect('/books');
    return;
  }
  
  res.send("You must be an admin");
};

module.exports.rent = async (req, res) => {
  let session = req.signedCookies.sessionId;
  let user = await User.findOne({ id: req.cookies.userId });
  let sessionId = await Session.findOne({ id: session });
  
  let x = sessionId.get('transaction')
    
  // filter transactions without users
  let y = x.filter(item => {
    return !item.userId
  });

  // Get array id of transactions filtered
  let z = y.map(item => {
    return item.id;
  });

  for (let i = 0; i < z.length; i++) {
    
    let purchasedBook = sessionId.transaction.find((item) => {
      return item.id === z[i]
    });
    purchasedBook.name = user.name;
    purchasedBook.userId = user.id;
  
    sessionId.markModified('transaction');
    sessionId.save();
  };

  
  console.log(sessionId);
  
  let sessionUpdated = await Session.findOne({ id: session });
  let newTransactions = sessionUpdated.get('transaction');

  for (let i = 0; i < newTransactions.length; i++) {
    await Transaction.insertMany(newTransactions[i]);
  }
  
  await Session.findOneAndUpdate(
      { id: session },
      { $set: 
         {
           cart: []
         },
      }
    );
  await Session.findOneAndUpdate(
      { id: session },
      { $set: 
         {
           transaction: []
         },
      }
    )
  

  res.redirect('/transactions');
}