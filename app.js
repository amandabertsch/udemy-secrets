//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// ----- Schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

// ----- Routes
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/register", function(req, res) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      })
    });
  });

});


app.post("/login", function(req, res) {

  User.findOne({
    email: req.body.username
  }, function(err, foundUser) {
    if (err) {
      res.send(err);
    } else { //found user
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets")
          }
          else {
            res.send("No user found with those details");
          }
        })
      } else {
        res.send("No user found with those details");
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
