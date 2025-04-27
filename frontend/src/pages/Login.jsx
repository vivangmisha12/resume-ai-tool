// src/pages/Login.jsx
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/actions/user';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const userState = useSelector((state) => state.user);
  const { user, isAuthenticated, loading } = userState;

  if (isAuthenticated) {
    navigate('/'); // Redirect to homepage if already authenticated
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://18.204.106.61:8000/api/v1/user/auth/login',
        formData,
        { withCredentials: true }
      );

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      dispatch(loadUser());

      toast.success('✅ Login successful!');
      navigate('/', 1500);
    } catch (error) {
      console.error(error);
      toast.error('❌ Invalid login credentials');
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      
      {/* Light Dashboard style background */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        
        {/* Page title */}
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
          Resume Analyzer AI
        </h1>

        {/* White card */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Sign In to Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="text-purple-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
