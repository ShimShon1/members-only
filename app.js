const express = require("express");
const session = require("express-session");
const app = express();
const MongoStore = require("connect-mongo");
const router = require("./routes");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.DB_LINK);
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 },
    store: MongoStore.create({
      mongoUrl: process.env.DB_LINK,
    }),
  })
);

app.use("/", router);

app.listen(3000);
