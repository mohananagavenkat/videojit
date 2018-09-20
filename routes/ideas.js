const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

require("../models/Ideas");

const Idea = mongoose.model("ideas");

router.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      console.log(ideas);
      res.render("ideas", { ideas });
    })
    .catch(err => console.log(err));
});

router.get("/ideas/edit/:id", (req, res) => {
  // rendering edit form
  Idea.findOne({
    _id: req.params.id
  }).then(idea => res.render("editIdea", { idea }));
});

router.put("/ideas/edit/:id", (req, res) => {
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

router.get("/ideas/delete/:id", (req, res) => {
  // Deleting Idea
  Idea.deleteOne({
    _id: req.params.id
  })
    .then(data => {
      console.log(data);
      res.redirect("/ideas");
    })
    .catch(err => console.log(error));
});

router.get("/newidea", (req, res) => {
  res.render("newIdea");
});

router.post("/newidea", (req, res) => {
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
    const newIdea = new Idea({ idea, details });
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
