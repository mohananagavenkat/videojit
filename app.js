const express = require("express");

const exphbs = require("express-handlebars");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

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

const Idea = mongoose.model("ideas");

// Configuring the views
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

// middleware to serve static files from assets folder
app.use(express.static("assets"));

// bodyParser middle for parsing request body
app.use(bodyParser.urlencoded({ extended: false })) // parse urlencoded data
app.use(bodyParser.json()) // parse application/json data


//Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ideas",(req,res)=>{
  Idea
    .find({})
    .sort({ date: "desc" })
    .then(ideas => res.render("ideas",{ ideas }))
    .catch( err => console.log(err) )
})

app.get("/newidea", (req, res) => {
  res.render("newIdea");
})

app.post("/newidea", (req, res) => {
  console.log(req.body);
  const errors = [];
  const {idea,details} = req.body;
  if(!idea){
    errors.push({ message:"Please enter your idea" });
  }
  if (!details){
    errors.push({ message: "Please enter some brief details" });
  }
  if(errors.length > 0){
    res.render("newIdea",{
      errors,
      idea,
      details
    });
  }else{
    const newIdea = new Idea({idea,details});
    newIdea
      .save()
      .then( (data) => { res.redirect("/ideas") } )
      .catch( (err) => console.log(err) )
  }
})

const port = 5002;

// serving the application
app.listen(port, () => {
  console.log(`App is serving on http://localhost:${port}`);
});