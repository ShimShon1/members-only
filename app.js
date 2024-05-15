const express = require("express");
const session = require("express-session");
const app = express();
const MongoStore = require("connect-mongo");
const router = require("./routes");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

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
app.use(passport.session());

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          done(null, user);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (userid, done) {
  const user = await User.findOne({ _id: userid });
  done(null, user);
});

app.use("/", router);

app.listen(3000);
