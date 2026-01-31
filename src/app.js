const express = require("express");
const DB = require("./Config/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require('cors');

const app = express();

/* =========================
   MANUAL CORS + PREFLIGHT
   (MOST IMPORTANT PART)
========================= */
// app.use(cors())
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "http://localhost:5173",
// "https://iridescent-cassata-dcb65a.netlify.app" 
//  ];

//   const origin = req.headers.origin;
//   console.log(origin)

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );

//   // 🔥 Handle preflight request here itself
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://iridescent-cassata-dcb65a.netlify.app"
  ],
  credentials: true
}));


/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    console.log("✅ Database connected");

    app.listen(2100, () => {
      console.log("🚀 Server running on port 2100");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
