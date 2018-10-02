const express = require("express");

const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

const saltRounds = 10;

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/login", (req, res) => {
  // res.render("login");
});

router.post("/signup", (req, res) => {
  const errors = [];
  const { name, email, mobile, password, confirmpassword } = req.body;
  if (password != confirmpassword)
    errors.push({ message: "Password should be same in both fields" });
  if (password.length < 8)
    errors.push({ message: "Password should be minimum of 8 letters" });
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        errors.push({ mecssage: "Email already exist" });
        res.render("signup", { errors, name, email, password, mobile });
      } else {
        const newUser = new User({
          name,
          email,
          mobile,
          password
        });

        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
              console.log(err);
              return;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                console.log("User saved successfully");
                res.redirect("/login");
              })
              .catch(err => console.log);
          });
        });
      }
    })
    .catch(err => console.log);
});

module.exports = router;
