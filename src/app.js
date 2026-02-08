const express = require("express");
const DB = require("./Config/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require('cors');


const app = express();


// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://devcirclefrontendd.onrender.com",
//     "https://iridescent-cassata-dcb65a.netlify.app"
//   ],
//   credentials: true
// }));

/* 🔥 REQUIRED FOR RENDER 🔥 */
app.set("trust proxy", 1);

/* 🔥 CORS 🔥 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devcirclefrontendd.onrender.com",
      "https://iridescent-cassata-dcb65a.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static uploads folder
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const postRouter = require("./routes/post");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", postRouter);

/* =========================
   DATABASE + SERVER
========================= */

DB()
  .then(() => {
    console.log(" Database connected");

    app.listen(2100, () => {
      console.log(" Server running on port 2100");
    });
  })
  .catch((err) => {
    console.error(" Database connection error:", err);
  });
