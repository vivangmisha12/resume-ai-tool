import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/user';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { isAuthenticated } = userState;

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    toast.success('✅ Logout successful!');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <ToastContainer position="top-center" />

      {/* Navbar */}
      <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1
          className="md:text-3xl text-md font-extrabold tracking-wide text-purple-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Resume Analyzer AI
        </h1>
        <div className="space-x-6 text-lg font-medium">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-400 transition"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-20">
        <h2 className="md:text-5xl text-3xl font-extrabold leading-tight mb-6 text-gray-800">
          Land Your Dream Job <br /> with AI-Powered Resume Matching
        </h2>
        <p className="md:text-lg text-md mb-10 max-w-2xl text-gray-600">
          Upload your resume and job description to get instant feedback, skill gap analysis,
          and tailored recommendations using our smart AI engine.
        </p>
        <button
          onClick={handleAnalyzeClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
        >
          Analyze My Resume
        </button>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 shadow-md rounded-2xl bg-gray-100 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-purple-700">AI Matching Score</h3>
            <p className="text-gray-600">
              See how well your resume aligns with the job role using NLP-driven analysis.
            </p>
          </div>
          <div className="p-8 shadow-md rounded-2xl bg-gray-100 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-purple-700">Skill Gap Analysis</h3>
            <p className="text-gray-600">
              Identify missing or underrepresented skills that could cost you the job.
            </p>
          </div>
          <div className="p-8 shadow-md rounded-2xl bg-gray-100 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-purple-700">Section-wise Feedback</h3>
            <p className="text-gray-600">
              Get suggestions for improving clarity, format, and keyword density.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
