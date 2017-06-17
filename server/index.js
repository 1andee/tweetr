"use strict";

const PORT = 8080;
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";
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
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
