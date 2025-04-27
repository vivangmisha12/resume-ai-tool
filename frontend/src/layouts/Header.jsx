// Header.jsx
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {

    const navigate = useNavigate();

    const handleGenerate = () => {
        navigate('/upload');
    }

    const redirectToHome = () => {
      navigate('/');
    }

  return (
    <div className="flex justify-between items-center p-5 bg-white shadow-md fixed top-0 left-0 right-0 z-20">
      {/* Welcome message hidden on small screens */}
      <div className="hidden sm:block">
        <h1
          className="md:text-3xl text-lg font-extrabold tracking-wide text-purple-700 cursor-pointer"
          onClick={redirectToHome}
        >
          Resume Analyzer AI
        </h1>
      </div>

      {/* Controls for all screen sizes */}
      <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
        {/* Generate new resume button aligned to the left for small screens */}
        <button onClick={handleGenerate} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg justify-start hover:bg-purple-200 sm:ml-0 ml-auto">
          Generate new Resume
        </button>

        {/* Profile Avatar aligned to the right for small screens */}
        <div className="relative">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
