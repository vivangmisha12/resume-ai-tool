// routes.js or wherever you define routes

const express = require("express");
const router = express.Router();
const { generateResumeInsightsFromDb } = require("../controllers/insights.controller");
const { protect, isAuthenticated } = require("../middlewares/auth.middleware");

// Route to generate insights from the last added resume
router.get("/generate-insights", isAuthenticated, generateResumeInsightsFromDb);

module.exports = router;
