const express = require("express");
const { Router } = require("express");

const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { blacklist } = require("../blacklist");
const UserRouter = Router();
require("dotenv").config();

UserRouter.post("/register", async (req, res) => {

  const { name, email, gender, password, age, city, is_married } = req.body;
  const user= await UserModel.findOne({email})
      if(user){
         res.status(200).json({msg:"User already exist, please login"})
      }
      else{

      
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({
        name,
        email,
        gender,
        password: hash,
        age,
        city,
        is_married,
      });
      await user.save();
      res.status(200).send({ msg: "Registration successfull" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
}
})


UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successfull",
            token: jwt.sign({ userID: user._id }, process.env.secr,{expiresIn:"7d"}),
          });
        }
      });
    } else {
      res.status(400).send("Wrong credential");
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

UserRouter.get("/logout",(req,res)=> {
    const token = req.headers.authorization?.split(" ")[1]
try {
blacklist.push(token)
   res.status(200).json({msg:"the user has been logged out"})
} catch (error) {
    res.status(400).json({err:error.message})
}    
  })

module.exports = { UserRouter };

