const express = require("express");
const session = require("express-session");
const app = express();

require("dotenv").config();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 },
  })
);

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000);
