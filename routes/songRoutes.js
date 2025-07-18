const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadAudio, getAllSongs } = require("../controllers/songController");
const {
  userAuthenticationMiddleware,
  isAdmin,
} = require("../api/v1/middleware");

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post(
  "/upload",
  userAuthenticationMiddleware, // ✅ this replaces verifyToken
  // isAdmin, // <-- optional: only allow admin to upload
  upload.single("audio"),
  uploadAudio
);

// ❌ Removed the manual fetch-metadata route
// router.post("/fetch-metadata/:id", userAuthenticationMiddleware, fetchMetadata);

router.get("/", getAllSongs);

module.exports = router;
