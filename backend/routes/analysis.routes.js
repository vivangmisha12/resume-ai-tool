const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { resumeAnalysis } = require("../controllers/analysis.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Apply multer to your route like this:
router.post("/resume", isAuthenticated, upload.single("resume"), resumeAnalysis);

module.exports = router;
