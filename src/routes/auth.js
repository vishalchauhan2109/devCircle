const express = require("express");
const { validationSignup } = require("../utils/Validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req,res)=>{
      try {
        // Validation of data
    
        validationSignup(req);
    
        // Encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
    
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);
    
        //Creating a new  instance of the user mode
    
        const user = new User({
          firstName,
          lastName,
          emailId,
          password: passwordHash,
        });
        await user.save();
        res.send("new user added");
      } catch (err) {
        res.status(402).send(err.message);
      }
})

//login
authRouter.post("/login" ,async (req,res)=>{
    try {
    const { emailId, password } = req.body;

    // Email format check
    if (!validator.isEmail(emailId)) {
      throw new Error("Email-id is not valid");
    }

    // check for user in db
    const user = await User.findOne({ emailId: emailId });
    if (!user) {        //if not found
      return res.status(401).send({ error: "User not found" });
    }

    //if user founded then
    // Compare password
    const storedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, storedPassword);
    if (!isValidPassword) {
      throw new Error("check your password ");
    }

    //passwor is valid 

    //create JWT Token
    const token = await jwt.sign({_id: user._id},"Vishal@2109")


    //Add the token to the cookie and send the data response back to the user
    res.cookie("token", token,
      {
        expires: new Date(Date.now() + 8*36000000),
      }
    );

    //if password match
    res.send("Login successful" );
  } catch (error) {
    // console.error("Login error:", error);
    res.status(500).send(error + " " + "Something went wrong");
  }
})

//logout
authRouter.post("/logout" ,async (req,res) =>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now()),
    })

    res.send("logout successfully")
});

module.exports = authRouter;