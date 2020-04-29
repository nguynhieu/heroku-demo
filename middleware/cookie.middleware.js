let count = 0
module.exports.countCookie = (req, res, next) => {
  if (req.cookies) {
    count++;
  };
  
  next();
}