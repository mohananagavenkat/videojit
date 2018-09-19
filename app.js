const express = require("express");

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");

const app = express();

// Connecting to mongodb
mongoose
  .connect(
    "mongodb://localhost/videojit",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Loading Ideas Model

require("./models/Ideas");

const Idea = mongoose.model("IdeaModel");

// Configuring the views
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

const port = 5002;

// serving the application
app.listen(port, () => {
  console.log(`App is serving on http://localhost:${port}`);
});

//Routes
app.get("/", (req, res) => {
  res.render("home");
});
