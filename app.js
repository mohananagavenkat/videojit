const express = require("express");

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const methodOverride = require("method-override");

const passport = require("passport");

const passportSetup = require("./config/passportSetup");

const session = require("express-session");

const flash = require("connect-flash");

const app = express();

// Connecting to mongodb
mongoose
  .connect(
    "mongodb://localhost/videojit",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Configuring the views
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

// middleware to serve static files from assets folder
app.use(express.static("assets"));

// bodyParser middle for parsing request body
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded data
app.use(bodyParser.json()); // parse application/json data

// Method override middleware to support PUT, DELETE HTTP methods
app.use(methodOverride("_method"));

// configuring express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// configuring flash
app.use(flash());

//initializing passport and passport-session
app.use(passport.initialize());
app.use(passport.session());


// setting up some global variables which will be there for each request
app.use((req, res, next) => {
  // console.log(req.method,req.url);
  // console.log(req.flash("error"));
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

//Loading Routes

const ideaRoutes = require("./routes/ideas");

const generalRoutes = require("./routes/general");

const authRoutes = require("./routes/auth");

// using loaded routes

app.use(ideaRoutes);

app.use(generalRoutes);

app.use(authRoutes);

const port = 5002;

// serving the application
app.listen(port, () => {
  console.log(`App is serving on http://localhost:${port}`);
});
