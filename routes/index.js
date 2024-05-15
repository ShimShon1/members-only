const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
router.get("/", function (req, res) {
  console.log("at index", req.user);

  res.render("index");
});

router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/login", function (req, res) {
  res.render("login");
});
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
module.exports = router;
