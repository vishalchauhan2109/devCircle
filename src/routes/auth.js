const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // user check
    const user = await User.findOne({ emailId });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 👉 JWT banaya
    const jwtSecret = process.env.JWT_SECRET || "Vishal@2109";
    const token = jwt.sign(
      { _id: user._id },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.RENDER_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none", // cross-site frontend-backend cookie
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // response
    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message || "Login failed" });
  }
});


//logout
authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  res.send("Logged out");
});

module.exports = authRouter;