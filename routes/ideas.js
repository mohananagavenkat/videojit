const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

require("../models/Ideas");

const Idea = mongoose.model("ideas");

const { ensureAuthenticated } = require("../helpers/authHelper");

router.get("/ideas", ensureAuthenticated, (req, res) => {
  Idea.find({user:req.user.id})
    .sort({ date: "desc" })
    .then(ideas => {
      console.log(ideas);
      res.render("ideas", { ideas });
    })
    .catch(err => console.log(err));
});

router.get("/ideas/edit/:id", ensureAuthenticated, (req, res) => {
  // rendering edit form
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash("error_message","you are not authorized to do this action");
      res.redirect("/ideas");
      return;
    }
    res.render("editIdea", { idea })
  });
});

router.put("/ideas/edit/:id", ensureAuthenticated, (req, res) => {
  console.log("PUT HTTP METHOD");
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.idea = req.body.idea;
    idea.details = req.body.details;
    idea.save().then(data => {
      console.log(data);
      res.redirect("/ideas");
    });
  });
});

router.get("/ideas/delete/:id", ensureAuthenticated, (req, res) => {
  // Deleting Idea
  Idea.deleteOne({
    _id: req.params.id,
    user:req.user.id
  })
    .then(data => {
      if(data.n == 0){
        req.flash("error_message","There is something wrong");
      }
      console.log(data);
      res.redirect("/ideas");
    })
    .catch(err => console.log(error));
});

router.get("/newidea", ensureAuthenticated,(req, res) => {
  res.render("newIdea");
});

router.post("/newidea", ensureAuthenticated, (req, res) => {
  console.log(req.body);
  const errors = [];
  const { idea, details } = req.body;
  if (!idea) {
    errors.push({ message: "Please enter your idea" });
  }
  if (!details) {
    errors.push({ message: "Please enter some brief details" });
  }
  if (errors.length > 0) {
    res.render("newIdea", {
      errors,
      idea,
      details
    });
  } else {
    const newIdea = new Idea({ idea, details, user: req.user.id });
    newIdea
      .save()
      .then(data => {
        console.log(data);
        res.redirect("/ideas");
      })
      .catch(err => console.log(err));
  }
});

module.exports = router;
