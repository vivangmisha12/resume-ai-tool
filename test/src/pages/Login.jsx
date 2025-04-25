import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8000/api/v1/user/auth/login", form, { withCredentials: true });  // Login request
    dispatch(loginSuccess(res.data));  // Update Redux store with user data and tokens
    navigate("/dashboard");  // Redirect to dashboard after login
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input name="email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mb-2" placeholder="Email" />
      <input type="password" name="password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="input mb-4" placeholder="Password" />
      <button type="submit" className="btn-primary">Login</button>
    </form>
  );
};

export default Login;
