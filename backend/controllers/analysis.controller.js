require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const User = require("../models/user.model");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Upload to Cloudinary
const uploadToCloudinary = async (filePath) => {
  const res = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
  });
  return res.public_id;
};

// Extract text from PDF/DOCX
const extractTextFromFile = async (file) => {
  const filePath = file.path;

  if (file.mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error("Unsupported file type. Upload a PDF or DOCX.");
  }
};

// Gemini Extraction
const extractWithGemini = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Extract the following information from this resume:
- education
- experience
- skills
- certifications
- projects
- achievements
- summary

Resume:
${resumeText}
`;

  console.log("Prompt being sent to Gemini for extraction:", prompt); // Debugging log

  const result = await model.generateContent(prompt);
  const response = await result.response;

  // Log the raw response to check what we're receiving
  console.log("Raw Gemini Response:", response);

  const responseText = response.text(); // Get the raw text

  // Log the raw text to inspect its contents
  console.log("Response Text from Gemini:", responseText);

  try {
    // Extract the structured data from the response text manually
    const parsedData = parseStructuredText(responseText);
    return parsedData;
  } catch (error) {
    // If it fails, log the error and return the raw response text
    console.error("Error extracting structured data:", error);
    return { rawResponse: responseText }; // Fallback to raw response
  }
};

// Function to manually parse structured text into data fields
const parseStructuredText = (text) => {
  let education = "";
  let experience = "";
  let skills = "";
  let certifications = "";
  let projects = "";
  let achievements = "";
  let summary = "";

  // Regular expressions to extract each field
  const eduMatch = text.match(/Education:([\s\S]*?)(?=Experience:|Skills:|Certifications:|Projects:|Achievements:|Summary:|$)/);
  const expMatch = text.match(/Experience:([\s\S]*?)(?=Skills:|Certifications:|Projects:|Achievements:|Summary:|$)/);
  const skillsMatch = text.match(/Skills:([\s\S]*?)(?=Certifications:|Projects:|Achievements:|Summary:|$)/);
  const certMatch = text.match(/Certifications:([\s\S]*?)(?=Projects:|Achievements:|Summary:|$)/);
  const projMatch = text.match(/Projects:([\s\S]*?)(?=Achievements:|Summary:|$)/);
  const achMatch = text.match(/Achievements:([\s\S]*?)(?=Summary:|$)/);
  const summMatch = text.match(/Summary:([\s\S]*?)(?=$)/);

  if (eduMatch) education = eduMatch[1].trim();
  if (expMatch) experience = expMatch[1].trim();
  if (skillsMatch) skills = skillsMatch[1].trim();
  if (certMatch) certifications = certMatch[1].trim();
  if (projMatch) projects = projMatch[1].trim();
  if (achMatch) achievements = achMatch[1].trim();
  if (summMatch) summary = summMatch[1].trim();

  return {
    education,
    experience,
    skills,
    certifications,
    projects,
    achievements,
    summary,
  };
};

// Gemini Analysis
const generateInsights = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Given the resume and job description below, generate the following:
- matchingScore (number between 0 and 100)
- skillGapAnalysis
- sectionWiseAnalysis
- overallAnalysis

Return the result in JSON format.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = response.text();

  try {
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return { rawResponse: responseText }; // Return raw text if parsing fails
  }
};

// Main analysis controller
exports.resumeAnalysis = async (req, res) => {
  try {
    console.log("Request Body:", req.user);
    const userId = req.user._id;
    const jobDescription = req.body.jobDescription;
    const file = req.file;

    console.log("Body:", req.body);
    console.log("File:", req.file);

    console.log("Job Description:", jobDescription);
    console.log("Uploaded File:", file); // 👈 should not be undefined!

    if (!file || !jobDescription) {
      return res.status(400).json({ message: "Resume file and job description are required." });
    }

    const resumeText = await extractTextFromFile(file);
    const fileid = await uploadToCloudinary(file.path);
    fs.unlinkSync(file.path); // Cleanup temp file

    const extracted = await extractWithGemini(resumeText);
    const insights = await generateInsights(resumeText, jobDescription);

    const user = await User.findById(userId);
    user.resumes.push({
      fileid,
      ...extracted,
      ...insights,
    });
    await user.save();

    res.status(200).json({
      message: "Resume analyzed and saved successfully.",
      data: user.resumes.slice(-1)[0],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
