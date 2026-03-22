require("dotenv").config();
const express = require("express");
const DB = require("./Config/database");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");

const app = express();

/* =========================
   TRUST PROXY (IMPORTANT)
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS CONFIG (CLEAN)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  "https://dev-circlee.netlify.app",
  "https://devcirclefrontendd.onrender.com",
  "https://iridescent-cassata-dcb65a.netlify.app",
  "https://devcirclefrontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   SERVER
========================= */

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 2100;

DB()
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });