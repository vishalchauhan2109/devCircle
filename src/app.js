const express = require("express");
const DB = require("./Config/database");
const app = express();
const cookieparser = require("cookie-parser");
// const cors = require("cors")
const path = require("path");

// const cors = require("cors");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://devcirclefrontendd.onrender.com"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieparser());

//import all the routes
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const postRouter = require("./routes/post");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",postRouter);

DB()
  .then(() => {
    console.log("database is connected");

    app.listen(2100, () => {
      console.log("your server is created ",`${2100}`);
    });
  })
  .catch((error) => {
    console.log("error");
  });
