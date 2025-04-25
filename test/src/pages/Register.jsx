import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/v1/user/auth/register", form);  // Send data to register endpoint
    navigate("/login");  // Redirect to login page after successful registration
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input name="name" onChange={handleChange} className="input mb-2" placeholder="Name" />
      <input name="email" onChange={handleChange} className="input mb-2" placeholder="Email" />
      <input type="password" name="password" onChange={handleChange} className="input mb-4" placeholder="Password" />
      <button type="submit" className="btn-primary">Register</button>
    </form>
  );
};

export default Register;
