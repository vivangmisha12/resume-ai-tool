// src/pages/Login.jsx
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loadUser } from '../redux/actions/user';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Access redux dispatch
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/auth/login',
        formData,
        { withCredentials: true }
      );

      // Store tokens in localStorage
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Dispatch loadUser to update Redux state with logged-in user
      dispatch(loadUser());

      toast.success('✅ Login successful!');
      navigate('/test'); // Navigate to the test page after successful login
    } catch (error) {
      console.error(error);
      toast.error('❌ Invalid login credentials');
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center mt-6 text-white">Resume Analyzer AI</h1>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign In to Resume Analyzer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition">
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-400">
            Don’t have an account?{' '}
            <Link to="/user/auth/register" className="text-blue-400 underline hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
