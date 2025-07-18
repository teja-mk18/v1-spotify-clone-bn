const express = require("express");
const { authRouter } = require("./auth/routes");
const { usersRouter } = require("./users/routes");
const { userAuthenticationMiddleware } = require("./middleware");
const songRoutes = require("../../routes/songRoutes");
const likedRoutes = require('./likedRoutes');

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/songs", songRoutes);

apiRouter.use(userAuthenticationMiddleware); // authentication

// all the routes below this middleware are now (protected APIs)

apiRouter.use("/users", usersRouter);
apiRouter.use("/liked", likedRoutes);

// Add health check endpoint
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    isSuccess: true,
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = { apiRouter };
