const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

//get requests
router.get("/", function (req, res) {
  console.log("at index", req.user);
  if (req.isAuthenticated()) {
    res.render("index", { user: req.user });
  } else {
    res.render("index");
  }
});

router.get("/register", function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("message", { message: "You are already logged in!" });
  } else {
    res.render("register");
  }
});
router.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("message", { message: "You are already logged in!" });
  } else {
    res.render("login");
  }
});

router.get("/members-form", function (req, res) {
  if (!req.isAuthenticated()) {
    res.render("message", {
      message: "Not even a user, how would you be a memeber???",
    });
    return;
  }
  res.render("members_form");
});

//post  requestsc
router.post("/register", async function (req, res, next) {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({
      username: req.body.username,
      password: hash,
      fullName: req.body.fullName,
    });
  } catch (error) {
    next(error);
  }

  res.redirect("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

router.post("/members-form", async function (req, res, next) {
  if (req.body.membersCode === process.env.MEMBERS_CODE) {
    req.user.isMember = true;
    await req.user.save();
    res.render("message", { message: "Welcome, member" });
  } else {
    res.render("members_form");
  }
});

module.exports = router;
