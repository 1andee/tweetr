"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
var path = require('path');

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

  // Pass in `UserHelpers` object to generate random avatars
  const userHelper = require("./lib/util/user-helper")

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.get("/", (req, res) => {
    var user = req.session.user;
    let templateVars = {
      user
    };
    res.render("index", templateVars);
  });

  app.get("/login", (req, res) => {
    var user = req.session.user;
    let templateVars = {
      user
    };
    res.render("login", templateVars)
  });

  app.get("/register", (req, res) => {
    var user = req.session.user;
    let templateVars = {
      user
    };
    res.render("register", templateVars)
  });

  app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  app.post("/register", (req, res) => {
    if (!req.body.handle ||
      !req.body.name   ||
      !req.body.email  ||
      !req.body.password) {
        // Registration fields were left blank
        req.flash('danger', "Please complete all required fields.");
        return res.redirect("/register");
      }

      let prefix = "@";
      let userHandle = req.body.handle;
      let cleanHandle = userHandle.replace("@", "");
      let handle = prefix += cleanHandle;

      const user = {
        handle: handle,
        name: req.body.name,
        email: req.body.email,
        password_digest: bcrypt.hashSync(req.body.password, 10),
        avatars: {
          small: req.body.avatar ? req.body.avatar : userHelper.generateRandomAvatar(),
          regular: '',
          large: ''
        },
        created_at: Date.now()
      };

      req.session.user = user;

      db.collection("users").save(user);
       return res.redirect('/');
    });

    app.post("/login", (req, res) => {
      if (!req.body.handle ||
        !req.body.password) {
          // Username or password field was blank
          req.flash('danger', "Please check your username and/or password.");
          return res.redirect("/login");
        };

        let handle = `@${req.body.handle}`;

        // Lookup user by email
        db.collection("users").findOne({
          'handle': handle
        }, ((err, user)=> {
          if (err) {
            throw err
          }
          if (user) {
            // User found in database
            if (bcrypt.compareSync(req.body.password, user.password_digest)) {
              // Password matches
              req.session.user = user;
              return res.redirect('/');
            } else {
              // Password doesn't match
              req.flash('danger', "Please check your username and/or password.");
              return res.redirect("/login");
            }
          } else {
            // User doesn't exist
            req.flash('danger', "Please check your username and/or password.");
            return res.redirect("/login");
          }
        }));

      });

    });

    app.listen(PORT, () => {
      console.log("Tweeter app listening on port " + PORT);
    });
