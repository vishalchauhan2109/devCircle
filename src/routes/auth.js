const express = require("express");
const { validationSignup } = require("../utils/Validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

console.log("999999");

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data

    validationSignup(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password, photoURL, about } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //Creating a new  instance of the user mode

    const firstname =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

    const lastname =
      lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    const user = new User({
      firstName: firstname,
      lastName: lastName,
      emailId,
      password: passwordHash,
      photoURL,
      about,
    });
    await user.save();
    res.send("new user added");
  } catch (err) {
    console.log(err);
    res.status(402).send(err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ JWT (use env in production)
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "Vishal@2109",
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required on Render / Netlify
      sameSite: "none", // required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        photoURL: user.photoURL,
        about: user.about,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("logout successfully");
});

module.exports = authRouter;
