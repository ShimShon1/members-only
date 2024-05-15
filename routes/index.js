const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
router.get("/", function (req, res) {
  res.render("index");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", async function (req, res, next) {
  console.log(req.body);
  try {
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      if (err) {
        next(err);
      } else {
        await User.create({
          username: req.body.username,
          password: hash,
          fullName: req.body.fullName,
        });
      }
    });
  } catch (error) {
    next(error);
  }

  res.render("register");
});

module.exports = router;
