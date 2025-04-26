// analysis.controller.js

const User = require("../models/user.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate insights
const generateResumeInsights = async (resumeData, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Given the resume and job description below, generate the following:
- matchingScore (number between 0 and 100)
- skillGapAnalysis
- sectionWiseAnalysis
- overallAnalysis

Return the result in JSON format.

Resume:
${resumeData}

Job Description:
${jobDescription}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  try {
    console.log("Raw Gemini API Response:", response); // Log the raw response for debugging
    
    // Assuming response.text is the raw string
    const responseText = response.text || response;
    console.log(responseText);

    // Try to parse the response if it's a valid JSON
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return { rawResponse: response.text || response }; // Return raw response if parsing fails
  }
};

// New route to generate insights from stored resumes
exports.generateResumeInsightsFromDb = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the latest resume data for the user
    const user = await User.findById(userId);
    const latestResume = user.resumes[user.resumes.length - 1];

    if (!latestResume) {
      return res.status(400).json({ message: "No resume data found for this user." });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required." });
    }

    const resumeData = `
Education: ${latestResume.education}
Experience: ${latestResume.experience}
Skills: ${latestResume.skills}
Certifications: ${latestResume.certifications}
Projects: ${latestResume.projects}
Achievements: ${latestResume.achievements}
Summary: ${latestResume.summary}
`;

    // Get insights using Gemini
    const insights = await generateResumeInsights(resumeData, jobDescription);

    // If the response is empty or malformed
    if (!insights || !insights.matchingScore || !insights.skillGapAnalysis || !insights.sectionWiseAnalysis || !insights.overallAnalysis) {
      return res.status(500).json({ message: "Invalid response from Gemini API.", insights });
    }

    // Update the resume data with the new insights
    latestResume.matchingScore = insights.matchingScore;
    latestResume.skillGapAnalysis = insights.skillGapAnalysis;
    latestResume.sectionWiseAnalysis = insights.sectionWiseAnalysis;
    latestResume.overallAnalysis = insights.overallAnalysis;

    // Save updated resume
    await user.save();

    res.status(200).json({
      message: "Resume insights generated and saved successfully.",
      data: latestResume,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
