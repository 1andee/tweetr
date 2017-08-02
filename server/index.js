"use strict";

require('dotenv').config();

const PORT = 8080;
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const bodyParser = require("body-parser");

const app = express();
app.set('port', (process.env.NODE || 3000))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

});


app.listen(PORT, () => {
  console.log("Tweeter app listening on port " + PORT);
});
