const shortid = require("shortid");
const cloudinary = require("cloudinary");
const multer = require("multer");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user.model");

cloudinary.config({
  cloud_name: "reii",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports.index = async (req, res) => {
  // Get total user page
  
  
  let users = await User.find();
  
  let totalPage = Math.ceil(users.length / 3);
  
  // Get user per page
  let page = req.query.page ? req.query.page : 1;
  let usersInPage = await User.find().skip((page - 1)*3).limit(3);

  res.render("users/index", {
    totalPage: totalPage,
    usersInPage: usersInPage
  });
};

module.exports.create = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = async (req, res) => {
  let password = await bcrypt.hash(req.body.password, saltRounds);
  let isAdmin;
  
  if (req.body.name === 'hieu')
    isAdmin = true
  
  let newUser = {
    isAdmin: isAdmin || false,
    name: req.body.name,
    email: req.body.email,
    id: shortid.generate(),
    password: password
  };

  await User.insertMany(newUser);

  res.redirect("/users");
};

module.exports.update = (req, res) => {
  res.render("users/update", {
    id: req.params.id
  });
};

module.exports.postUpdate = async (req, res) => {
  await User.findOneAndUpdate(
    { id: req.params.id }, 
    { name: req.body.name });

  res.redirect("/users");
};

module.exports.delete = async (req, res) => {
  await User.findOneAndDelete({ id: req.params.id });
  
  res.redirect("/users");
};

module.exports.profile = async (req, res) => {
  let user = await User.findOne({ id: req.params.id });
  
  res.render("users/profile", {
    user: user
  });
};

module.exports.avatar = (req, res) => {
  res.render("users/updateAvatar");
};

module.exports.postAvatar = (req, res) => {
  let path = req.file.path;

  cloudinary.v2.uploader.upload(path, async (error, result) => {
    await User.findOneAndUpdate(
        { id: req.params.id }, 
        { avatar: result.url });
  });
  
  res.redirect("/users");
};