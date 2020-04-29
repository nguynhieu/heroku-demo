module.exports.requireAuth = (req, res, next) => {
  if (!req.cookies.userId) {
    res.redirect('/login');
    return;
  } else next();
}