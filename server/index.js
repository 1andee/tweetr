"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const flash = require('express-flash');

const app = express();
app.set("view engine", "ejs");
app.set('port', (process.env.NODE || 3000))
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ["key 1"]
}));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  // Pass in `DataHelpers` object so it can define routes and interact with the data layer.
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets.js")(DataHelpers);
  const userRoutes = require("./routes/users.js")(DataHelpers);

  // Pass in `UserHelpers` object to generate random avatars
  const userHelper = require("./lib/util/user-helper")

  // Mount the routes:
  app.use("/tweets", tweetsRoutes);
  app.use("/users", userRoutes);

  app.get("/", (req, res) => {
    let templateVars = {
      user: req.session.user
    };
    res.render("index", templateVars);
  });

  app.get("/login", (req, res) => {
    let user = req.session.user;
    if (user) {
      res.redirect('/');
    } else {
      let templateVars = {
        user: user
      };
      res.render("login", templateVars)
    };
  });

  app.get("/register", (req, res) => {
    let user = req.session.user;
    if (user) {
      res.redirect('/');
    } else {
      let templateVars = {
        user: user
      };
      res.render("register", templateVars)
    };
  });

});

app.listen(PORT, () => {
  console.log("Tweeter app listening on port " + PORT);
});
