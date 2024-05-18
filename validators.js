const { body } = require("express-validator");

exports.postValidation = function postValidation(req, res, next) {
  return [
    body("title")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Title should have at least 2 characters"),
    body("content")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Content should have at least 2 characters"),
  ];
};

exports.loginValidation = function postValidation(req, res, next) {
  return [
    body("username")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Username should have at least 2 characters"),
    body("password")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Password should have at least 2 characters"),
  ];
};

exports.registerValidation = function postValidation(req, res, next) {
  return [
    body("username")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Username should have at least 2 characters"),
    body("fullName")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Full name should have at least 2 characters"),
    body("password")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .withMessage("Password should have at least 2 characters"),
    body("confirmPassword")
      .isString()
      .escape()
      .trim()
      .isLength(2)
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Passwords should match"),
  ];
};
