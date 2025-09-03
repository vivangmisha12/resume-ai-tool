import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  skills: [String],
  experience: String,
  education: String,
  extractedText: String
}, { timestamps: true });

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
