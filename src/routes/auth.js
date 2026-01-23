const express = require("express");
const { validationSignup } = require("../utils/Validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

console.log("999999");

//signup
authRouter.post("/signup", async (req,res)=>{
      try {
        // Validation of data
    
        validationSignup(req);
    
        // Encrypt the password
        const { firstName, lastName, emailId, password,photoURL,about} = req.body;
    
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);
    
        //Creating a new  instance of the user mode
        
        const firstname = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(); 
        
        const lastname = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(); 
        const user = new User({
          firstName : firstname,
          lastName : lastName,
          emailId,
          password: passwordHash,
          photoURL,
          about
        });
        await user.save();
        res.send("new user added");
      } catch (err) {
        console.log(err)
        res.status(402).send(err.message);
      }
})

//login
authRouter.post("/login" ,async (req,res)=>{
  console.log("call in login");
    try {
    const { emailId, password } = req.body;

    

    // Email format check
    if (!validator.isEmail(emailId)) {
      throw new Error("Email-id is not valid");
    }

    // check for user in db
    const user = await User.findOne({ emailId: emailId });
    if (!user) {        //if not found
      return res.status(401).send({ error: "PLease check Your Username Or Password again" });
    }

    //if user founded then
    // Compare password
    const storedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, storedPassword);
    if (!isValidPassword) {
      throw new Error("check your password ");
    }

    //password is valid 

    //create JWT Token
    const token = await jwt.sign({_id: user._id},"Vishal@2109")


    //Add the token to the cookie and send the data response back to the user
    res.cookie("token", token,
      {
        expires: new Date(Date.now() + 8*36000000),
      }
    );

    //if password match
    // res.send("Login successful" );
    res.status(200).json(user);
  } catch (error) {
    // console.error("Login error:", error);
    res.status(500).send("Please check Your UserName Or Password again");
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