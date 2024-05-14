const express = require("express");

const app = express();

require("dotenv").config();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000);
