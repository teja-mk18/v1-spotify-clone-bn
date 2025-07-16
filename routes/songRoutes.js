const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadAudio,
  fetchMetadata,
  getAllSongs,
} = require("../controllers/songController");
const { verifyToken, isAdmin } = require("../middleware/auth");

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
  verifyToken,
  isAdmin,
  upload.single("audio"),
  uploadAudio
);
router.post("/fetch-metadata/:id", verifyToken, isAdmin, fetchMetadata);
router.get("/", getAllSongs);

module.exports = router;
