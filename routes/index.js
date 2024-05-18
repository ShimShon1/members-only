const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const {
  postValidation,
  loginValidation,
  registerValidation,
} = require("../validators");
const {
  indexController,
  loginController,
  registerController,
} = require("../getControllers");

//index | posts page
router.get("/", indexController);

router.post(
  "/",
  postValidation(),
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array();
      next();
      return;
    }
    try {
      if (req.isAuthenticated()) {
        await Post.create({
          title: req.body.title,
          content: req.body.content,
          date: new Date(),
          user: req.user.id,
        });
      }
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  indexController
);

//register form
router.get("/register", registerController);

router.post(
  "/register",
  registerValidation(),
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array();
      next();
      return;
    }
    try {
      const userExists = await User.exists({
        username: req.body.username,
      }).collation({ locale: "en", strength: 2 });
      if (userExists) {
        req.errors = [{ msg: "Username is taken" }];
        next();
        return;
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      await User.create({
        username: req.body.username,
        password: hash,
        fullName: req.body.fullName,
      });
      res.redirect("login");
    } catch (error) {
      next(error);
    }
  },
  registerController
);

router.get("/members-form", function (req, res) {
  if (!req.isAuthenticated()) {
    res.render("message", {
      message: "Not even a user, how would you be a memeber???",
    });
    return;
  }
  res.render("members_form", { user: req.user });
});

//login form
router.get("/login", loginController);

router.post(
  "/login",
  loginValidation(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array();
      loginController(req, res, next);
    } else {
      next();
    }
  },
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err); // Handle any errors during authentication
      }
      if (!user) {
        // Handle the failure case manually
        req.errors = [{ msg: "Wrong user credentials" }];
        next();
        return; // Customize the response
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },
  loginController
);

router.get("/logout", function (req, res) {
  req.logout((err) => (err ? next(err) : res.redirect("/")));
});

router.post("/members-form", async function (req, res, next) {
  try {
    if (req.body.membersCode === process.env.MEMBERS_CODE) {
      req.user.isMember = true;
      await req.user.save();
      res.render("message", {
        message: "Welcome, member",
        user: req.user,
      });
    } else {
      res.render("members_form", {
        user: req.user,
        errors: [{ msg: "Wrong members code!" }],
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/delete/:id", async function (req, res, next) {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
