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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(morgan("dev")); // global middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRouter);
app.use("/api/songs", songRoutes);

app.listen(process.env.PORT, () => {
  console.log("-------- Server started --------");
});
