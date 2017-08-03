"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const randomizer = require("./lib/util/randomizer");
var path = require('path');

const app = express();
app.set('port', (process.env.NODE || 3000))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.get("/register", (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/register.html'));
  });

  app.post("/register", (req, res) => {
    if (!req.body.handle ||
      !req.body.name   ||
      !req.body.email  ||
      !req.body.password) {
        res.status(400).send('Invalid request: missing data in POST body');
        return;
      }

      let user_id = randomizer();

      const user = {
        user_id: user_id,
        handle: req.body.handle,
        name: req.body.name,
        email: req.body.email,
        password_digest: bcrypt.hashSync(req.body.password, 10),
        created_at: Date.now()
      };
      console.log(user);

      req.session.user_id = user_id;

      db.collection("users").save(user);
      console.log("New user successfully saved")
      return res.redirect('/');
    });

  });

  app.listen(PORT, () => {
    console.log("Tweeter app listening on port " + PORT);
  });
