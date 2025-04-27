const User = require("../models/user.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate insights
const generateResumeInsights = async (resumeData, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Given the resume and job description below, generate the following fields:

- matchingScore (number between 0 and 100)
- skillGapAnalysis
- sectionWiseAnalysis
- overallAnalysis

⚡ VERY IMPORTANT: Only return pure JSON. Do not wrap the output inside \`\`\`json or \`\`\`. No explanations, no formatting.

Resume:
${resumeData}

Job Description:
${jobDescription}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  try {
    let textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Extracted Gemini Response Text:", textContent);

    if (!textContent) {
      throw new Error("No text content found in Gemini response.");
    }

    // 🛠️ Clean the response if it accidentally wrapped in markdown
    textContent = textContent.trim();
    if (textContent.startsWith("```json")) {
      textContent = textContent.replace(/^```json/, "").trim();
    }
    if (textContent.startsWith("```")) {
      textContent = textContent.replace(/^```/, "").trim();
    }
    if (textContent.endsWith("```")) {
      textContent = textContent.slice(0, -3).trim();
    }

    const parsedResponse = JSON.parse(textContent);
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return null; // Return null if parsing fails
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

    const jobDescription = latestResume.jobDescription;
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

    if (!insights) {
      return res.status(500).json({ message: "Failed to generate insights from Gemini API." });
    }

    console.log("======================================================================");
    console.log("dhanush", insights.sectionWiseAnalysis);

    // Save the insights into the respective fields in resume
    latestResume.matchingScore = insights.matchingScore;
    latestResume.skillGapAnalysis = {
      missingSkills: insights.skillGapAnalysis.missingSkills || [],
      partiallyMatchingSkills: insights.skillGapAnalysis.partiallyMatchingSkills || [],
      strongMatchingSkills: insights.skillGapAnalysis.strongMatchingSkills || []
    };
    latestResume.sectionWiseAnalysis = {
      Education: insights.sectionWiseAnalysis.Education || "",
      Experience: insights.sectionWiseAnalysis.Experience || "",
      Skills: insights.sectionWiseAnalysis.Skills || "",
      Projects: insights.sectionWiseAnalysis.Projects || "",
      Certifications: insights.sectionWiseAnalysis.Certifications || "",
      Achievements: insights.sectionWiseAnalysis.Achievements || ""
    };
    latestResume.overallAnalysis = insights.overallAnalysis;    

    console.log("hello world", latestResume);
    // Save updated resume
    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume insights generated and saved successfully.",
      data: latestResume,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
