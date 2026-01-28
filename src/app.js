const express = require("express");
const DB = require("./Config/database");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors")
const path = require("path");

app.use(cors(
  
  {
    
  origin : "http://localhost:5173",
  credentials:true,
  }
));

app.use(express.json());
app.use(cookieparser());

//import all the routes
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const postRouter = require("./routes/post");

app.use(express.json());
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
      console.log("your server is created ");
    });
  })
  .catch((error) => {
    console.log("error");
  });
