const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

const bcrypt = require("bcrypt");

const VerifyToken = require("../models/VerifyToken");
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
            if (!user.isVerified) {
              VerifyToken.findOne({ _userId: user.id })
                .then(tokenRecord => {
                  if (!tokenRecord) {
                    return done(null, false, {
                      message: `Something went wrong! Please contact support team.`
                    });
                  }
                  return done(null, false, {
                    message: `Account is not activated yet! If you didn't receive activation email <a href="http://localhost:5002/resend_verify_email/${
                      tokenRecord.id
                    }" >Click Here</a> `
                  });
                })
                .catch(err => {
                  console.log(err);
                  return done(null, false, {
                    message: `Something went wrong! Please contact support team.`
                  });
                });
            } else {
              return done(null, user);
            }
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
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
