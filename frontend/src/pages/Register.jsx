import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate,Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/auth/register', formData);
      toast.success('✅ Signup successful!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      toast.error('❌ Signup failed');
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center mt-6 text-white">Resume Analyzer AI</h1>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up to Resume Analyzer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition">
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/user/auth/login" className="text-blue-400 underline hover:text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
