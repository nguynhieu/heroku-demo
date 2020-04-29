const express = require("express");
const app = express();
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.set("useUnifiedTopology", true);
mongoose.set('useFindAndModify', false);

mongoose.connect(
  process.env.MONGODB_URL, { 
  useNewUrlParser: true,
  useCreateIndex: true
});

const userRoute = require('./routes/user.route');
const bookRoute = require('./routes/book.route');
const transactionRoute = require('./routes/transaction.route');
const authRoute = require('./routes/auth.route');

const cookieMiddleware = require('./middleware/cookie.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const sessionMiddleware = require('./middleware/session.middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('MY SECRET'));
app.use(express.static("public"));

app.use(sessionMiddleware);

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.use('/books', cookieMiddleware.countCookie, bookRoute);

app.use('/login', authRoute)

app.use(authMiddleware.requireAuth);

app.use('/users', cookieMiddleware.countCookie, userRoute);
app.use('/transactions', transactionRoute);

app.use(function(req, res) {
  res.status(400);
  res.render('error/error404', {
    title: '404: File Not Found'
  });
});

app.use(function(error, req, res, next) {
  res.status(500);
  res.render('error/error500', {
    title: '500: Something went wrong'
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
