import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/user"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

const Test = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);

  const { user, isAuthenticated, loading } = userState;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login"); // redirect to login page after logout
  };

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <p>You are not authenticated</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">User Details</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <a href="/dashboard">dashboard</a>
      
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Test;
