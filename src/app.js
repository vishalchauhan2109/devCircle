const express = require("express");
const DB = require("./Config/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");

const app = express();

app.set("trust proxy", 1);

/* =========================
   CORS CONFIG
========================= */

const allowedOrigins = [
  // LOCAL DEVELOPMENT
  "http://localhost:5173",
  "http://localhost:3000", 
  "http://localhost:8000",
  "http://127.0.0.1:5173",
  
  // PRODUCTION DEPLOYMENTS
  "https://dev-circlee.netlify.app",
  "https://devcirclefrontendd.onrender.com",
  "https://iridescent-cassata-dcb65a.netlify.app",
  "https://devcirclefrontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, same-origin requests)
      if (!origin || origin === undefined) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ STATIC FILES (ONLY ONE TIME)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const postRouter = require("./routes/post");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", postRouter);

/* =========================
   404 HANDLER (IMPORTANT)
========================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   DATABASE + SERVER
========================= */

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 2100;

DB()
  .then(() => {
    console.log(" Database connected");

    server.listen(PORT, () => {
      console.log(" Server running on port 2100");
    });
  })
  .catch((err) => {
    console.error(" Database connection error:", err);
  });
