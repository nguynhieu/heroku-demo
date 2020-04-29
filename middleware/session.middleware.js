const shortid = require('shortid');

const Session = require('../models/session.model');

module.exports = async (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    let sessionId = shortid.generate();
    res.cookie('sessionId', sessionId, {
      signed: true
    });
    
    await Session.insertMany({
      id: sessionId,
      wrongLoginCount: 0
    })
  }
  
  next();
}