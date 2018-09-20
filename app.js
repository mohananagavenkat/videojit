const express = require("express");

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const methodOverride = require("method-override");

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

//Loading Routes

const ideaRoutes = require("./routes/ideas");

const generalRoutes = require("./routes/general");


// using loaded routes

app.use(ideaRoutes);

app.use(generalRoutes);


const port = 5002;

// serving the application
app.listen(port, () => {
  console.log(`App is serving on http://localhost:${port}`);
});
