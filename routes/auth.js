const express = require("express");

const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

const saltRounds = 10;

const passport = require("passport");

const { isAlreadyLoggedIn } = require("../helpers/authHelper");

const VerifyToken = require("../models/VerifyToken");

const crypto = require("crypto");

const mailer = require("../config/nodeMailerSetup");

router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/signup", isAlreadyLoggedIn, (req, res) => {
  res.render("signup");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.post("/signup", (req, res) => {
  const errors = [];
  const { name, email, mobile, password, confirmpassword } = req.body;
  if (password != confirmpassword)
    errors.push({ message: "Password should be same in both fields" });
  if (password.length < 8)
    errors.push({ message: "Password should be minimum of 8 letters" });
  if (errors.length > 0) {
    res.render("signup", { name, email, mobile, errors });
    return;
  }
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        errors.push({ message: "Email already exist" });
        res.render("signup", { errors, name, email, password, mobile });
        return;
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
              .then(user => {
                console.log("User saved successfully");
                const token = crypto.randomBytes(64).toString("hex");
                const url = ``;
                const newVerifyToken = new VerifyToken({
                  _userId: user.id,
                  token: token
                });
                newVerifyToken.save().then(() => {
                  let mailOptions = {
                    from: '"videojit 👻" <noreply@videojit.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Activation Link ✔", // Subject line
                    html: `<h3>Welcome to videojit 👻</h3>
                    <p>please click on the link to activate your account <a href="http://localhost:5002/activate_user/${token}">Click Here</a></p>`
                  };
                  mailer.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      return console.log(error);
                    }
                    console.log(
                      "Message sent successfully 👍. MessageId : %s",
                      info.messageId
                    );
                    res.render("notifying_about_activation_link", {
                      url: `http://localhost:5002/resend_verify_email/${newVerifyToken.id}`
                    });
                  });
                });
              })
              .catch(err => console.log);
          });
        });
      }
    })
    .catch(err => console.log);
});

router.get("/notifying_about_activation_link", (req, res) => {
  res.render("notifying_about_activation_link");
});

router.get("/activate_user/:token", (req, res) => {
  const token = req.params.token;
  VerifyToken.findOne({ token })
    .then(record => {
      if (!record) {
        req.flash(
          "error_message",
          "Somethig went wrong! Please try again later"
        );
        res.redirect("/login");
        return;
      }
      console.log(record);
      const userId = record._userId;
      User.findById(userId).then(user => {
        if (!user) {
          req.flash(
            "error_message",
            "Somethig went wrong! Please try again later"
          );
          res.redirect("/login");
          return;
        }
        else if(user.isVerified == true){
          req.flash(
            "success_message",
            "Your account has already been verified 😃"
          );
          res.redirect("/login");
          return;
        }
        user.isVerified = true;
        user.save().then(() => {
          console.log("user verified successfully");
          let mailOptions = {
            from: '"videojit 👻" <noreply@videojit.com>', // sender address
            to: user.email, // list of receivers
            subject: "Welcome Email 😍 ", // Subject line
            html: `<h3>Welcome to videojit 👻</h3>
                    <p>Here you can store your Ideas of future 😃</p>`
          };
          mailer.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log(
              "Message sent successfully 👍. MessageId : %s",
              info.messageId
            );
            req.flash(
              "success_message",
              "Account has been verified successfully 😃"
            );
            res.redirect("/login");
          });
        });
      });
    })
    .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_message", "Logged out successfully");
  res.redirect("/login");
});

module.exports = router;
