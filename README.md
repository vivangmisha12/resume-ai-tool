# 🦰 AI Resume Analyzer

An AI-powered MERN stack web application that analyzes resumes against job descriptions. It provides **matching scores**, **skill gap analysis**, **section-wise feedback**, and **overall improvement suggestions**. Built using **Google Gemini API**, **Cloudinary**, **MongoDB**, and modern frontend technologies.

---

## 🚀 Features

- Upload resumes (PDF/DOCX)
- Input job description
- AI-based:
  - Matching Score Calculation
  - Skill Gap Analysis
  - Section-Wise Feedback
  - Overall Resume Analysis
- Downloadable PDF report
- User Authentication (JWT-based)
- Cloudinary file storage
- Responsive UI (React + TailwindCSS)

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- TailwindCSS
- Redux Toolkit
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary SDK
- Google Gemini 1.5 Flash API
- JWT (Access/Refresh Token)

---

## 📆 Packages to Install

### Backend Packages

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cloudinary multer streamifier axios cors
npm install -D nodemon
```

### Frontend Packages

```bash
npm install react-router-dom axios redux react-redux @reduxjs/toolkit @headlessui/react @heroicons/react tailwindcss postcss autoprefixer
npm install -D vite
```

Tailwind Setup:
```bash
npx tailwindcss init -p
```

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in `/backend` and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_API_KEY=your_google_gemini_api_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```
Run the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Live Demo

> _[Add your deployment link if available]_  
Example: [View Live 1 - Vercel](https://dhanushk-adya-ai.vercel.app)
        [View Live 2 - AWS](http://18.204.106.61/)

---

## 📊 API Endpoints

| Method | Route | Description |
|:------:|:-----:|:------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| POST | /api/resume/analyze | Upload resume and get analysis |
| GET  | /api/user/profile | Get user profile details |

---

## 🧬 How It Works

1. **Upload Resume:** Upload PDF/DOCX resume.
2. **Paste Job Description:** Provide the job description.
3. **AI Analysis:** Google Gemini processes and matches.
4. **View Report:** Get detailed match score, missing skills, section feedback.
5. **Download PDF:** Download the analysis report.

---

## 👥 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📩 Contact

**Your Name**  
Email: [jvdhanush218@gmail.com](mailto:jvdhanush218@gmail.com)  
GitHub: [@JARVIS-DK](https://github.com/JARVIS-DK)

---


