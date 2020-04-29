const shortid = require('shortid');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Session = require('../models/session.model');
const User = require('../models/user.model');

const saltRounds = 10;

module.exports.login = (req, res) => {
  res.render('login');
}

module.exports.postLogin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  
  // get wrong login count
  let count1 = await Session
    .findOne({ id: req.signedCookies.sessionId })
  let count = count1.get('wrongLoginCount');
  
  // if undefined then set wrongLoginCount = 0
  if (!count) {
    await Session
    .findOneAndUpdate(
      { id: req.signedCookies.sessionId },
      { 'wrongLoginCount': 0 }  
    );
  };
  
  let user = await User.findOne({ email: email });
  
  if (!user) {
    res.render('login', {
        err: 'Not found user'
    });
    return;
  }
  
  let test = await bcrypt.compare(password, user.password);
  
  if (!test) {
    console.log(count)
    await Session
      .findOneAndUpdate(
        { id: req.signedCookies.sessionId },
        { 'wrongLoginCount': count + 1}
      );

    res.render('login', {
      email: email,
      err: 'Wrong password'
    });
    return;
  }
  
  const msg = {
    to: user.email,
    from: 'tthzicc@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>Someone is trying to sign in to your account</strong>',
  };
  
  
  if (count === 3) {
    sgMail.send(msg).then(() => {
      console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
    res.send('ERRRRRRRRRRRRRR');
    
    return;
  };
  
  res.cookie("userId", user.id);
  
  res.redirect('/books');
}