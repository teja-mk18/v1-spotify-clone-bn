const path = require("path");
const songRoutes = require("./routes/songRoutes");
const dotEnv = require("dotenv");
dotEnv.config();
require("./config/db");
require("./utils/emailHelpers");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { apiRouter } = require("./api/v1/routes");

const app = express();

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middleware
app.use(morgan("dev"));

// ✅ CORS Setup: Allow frontend and credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://v1-spotify-clone-fn.vercel.app",
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use("/api/v1", apiRouter);
app.use("/api/songs", songRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`-------- Server started on port ${PORT} --------`);
});
