const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const UserAuth = async (req, res, next) => {
//   console.log("inside userauth");
//   try {
//     const { cookies } = req;
//     const { token } = cookies;

//     if (!token) {
//       throw new Error("session expired");
//     }

//     const decode = jwt.verify(token, "Vishal@2109");

//     const id = decode._id;

//     const user = await User.findOne({ _id: id });
//     if (!user) {
//       throw new Error("user not found");
//     }

//     req.user = user;
//     // console.log(user)
//     next();
//   } catch (err) {
//     res.status(401).json({
//       error: err.message || "Authentication failed",
//     });
//   }
// };

const UserAuth = async (req, res, next) => {
  console.log("inside userauth");

  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Session expired" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "Vishal@2109"
    );

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

module.exports = { UserAuth };
