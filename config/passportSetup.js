const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      // console.log(username,password);
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, user.password, function(err, res) {
          if (err) {
            return done(err);
          }
          if (res) {
            return done(null, user);
          }
          return done(null, false, { message: "Incorrect password." });
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
