import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-500 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 bg-opacity-80 px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold tracking-wide text-yellow-400" to="/">Res-You-me</h1>
        <div className="space-x-6 text-lg font-medium">
          {/* <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-300 transition">About</Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link> */}
          <Link
  to="/auth"
  className="bg-yellow-400 text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-300 transition"
>
  Sign In
</Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          Land Your Dream Job <br /> with AI-Powered Resume Matching
        </h2>
        <p className="text-lg mb-8 max-w-2xl">
          Upload your resume and job description to get instant feedback, skill gap analysis,
          and tailored recommendations using our smart AI engine.
        </p>
        <Link
          to="/Auth"
          className="bg-green-500 px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-400 transition"
        >
          Analyze My Resume
        </Link>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-4 bg-white text-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow-md rounded-xl bg-gray-100">
            <h3 className="text-xl font-bold mb-2">AI Matching Score</h3>
            <p>See how well your resume aligns with the job role using NLP-driven analysis.</p>
          </div>
          <div className="p-6 shadow-md rounded-xl bg-gray-100">
            <h3 className="text-xl font-bold mb-2">Skill Gap Analysis</h3>
            <p>Identify missing or underrepresented skills that could cost you the job.</p>
          </div>
          <div className="p-6 shadow-md rounded-xl bg-gray-100">
            <h3 className="text-xl font-bold mb-2">Section-wise Feedback</h3>
            <p>Get suggestions for improving clarity, format, and keyword density.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home