"use strict";

const userHelper    = require("../lib/util/user-helper")
const bcrypt        = require('bcrypt');

const express       = require('express');
const userRoutes    = express.Router();

module.exports = function(DataHelpers) {

  userRoutes.post("/register", (req, res) => {
    if (!req.body.handle ||
      !req.body.name     ||
      !req.body.email    ||
      !req.body.password) {
        // Registration form fields were left blank
        req.flash('danger', "Please complete all required fields.");
        return res.redirect("/register");
    }

    // Prepend @ symbol to username
    let userHandle = req.body.handle;
    let cleanHandle = userHandle.replace("@", "");
    let handle = `@${cleanHandle}`;

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

    // Save cookie
    req.session.user = user;

    // Save user in `db` and redirect to home
    DataHelpers.saveUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        return res.redirect('/');
      }
    });

  });

  userRoutes.post("/login", (req, res) => {
    if (!req.body.handle ||
      !req.body.password) {
        // Username or password field was left blank
        req.flash('danger', "Please check your username and/or password.");
        return res.redirect("/login");
    };

    let handle = `@${req.body.handle}`;

    // Lookup user by email
    DataHelpers.getUser(handle, (err, user) => {
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
    });

  });

  return userRoutes;

}
