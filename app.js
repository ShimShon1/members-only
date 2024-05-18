const express = require("express");
const session = require("express-session");
const app = express();
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const router = require("./routes/index.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const { render } = require("pug");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.DB_LINK);
app.use(express.static("public"));
app.use(helmet());
const limiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(limiter);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
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

app.use(function (err, req, res, next) {
  console.log(err);
  res.render("message", { message: err.message, user: req.user });
});

app.listen(process.env.PORT || 3000);
