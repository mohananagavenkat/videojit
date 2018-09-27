const express = require("express");

const router = express.Router();

router.get("/login",(req,res)=>{
    res.render("login");
})

router.get("/signup",(req,res)=>{
    res.render("signup");
})

router.post("/login",(req,res)=>{
    // res.render("login");
})

router.post("/signup",(req,res)=>{
    // res.render("signup");
})

module.exports = router;
