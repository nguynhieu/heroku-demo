module.exports.userValidate = (req, res, next) => {
  let errors = [];
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  
  if (name.length > 30) {
    errors.push("Name should be less than 30 character");
  } else if (!req.body.name) {
    errors.push("Name is required");
  };
  
  if (!email) {
    errors.push("Age is required");
  }
  
  if (errors.length) {
    res.render('users/create', {
      errors: errors,
      email: email,
      name: name
    }) 
    return;
  }
  
  next();
};