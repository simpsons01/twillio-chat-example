require("dotenv").config();

// Node/Express
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const router = require("./src/router");

// Create Express webapp
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
  })
);
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// Add body parser for Notify device registration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// Get Sync Service Details for lazy creation of default service if needed

// Create http server and run it
const server = http.createServer(app);
const port = process.env.PORT || 3030;
server.listen(port, function () {
  console.log("Express server running on *:" + port);
});

module.exports = app;
