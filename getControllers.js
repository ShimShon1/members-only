const Post = require("./models/Post.js");

exports.indexController = async function (req, res, next) {
  try {
    const posts = await Post.find({})
      .populate("user")
      .sort({ date: -1 });
    if (req.isAuthenticated()) {
      res.render("index", {
        user: req.user,
        posts,
        errors: req.errors,
        failedPost: req.body,
      });
    } else {
      res.render("index", { posts });
    }
  } catch (error) {
    next(error);
  }
};

exports.loginController = function (req, res) {
  console.log(req.body);
  if (req.isAuthenticated()) {
    res.render("message", { message: "You are already logged in!" });
  } else {
    res.render("login", {
      failedlogin: req.body,
      errors: req.errors,
    });
  }
};

exports.registerController = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("message", { message: "You are already logged in!" });
  } else {
    res.render("register", {
      errors: req.errors,
      failedRegister: req.body,
    });
  }
};
