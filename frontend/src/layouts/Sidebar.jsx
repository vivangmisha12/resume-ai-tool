// Sidebar.jsx
import React, { useState } from 'react';
import { FaUser, FaClipboardList, FaComments, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`bg-white shadow-lg w-64 min-h-screen p-5 fixed left-0 top-0 z-30 md:block ${isOpen ? 'block' : 'hidden'} md:relative`}>
      <h1 className="text-2xl font-bold text-purple-600 mb-10">GenResume.io</h1>
      <nav className="flex flex-col gap-6 text-gray-700">
        <a href="#" className="flex items-center gap-3 hover:text-purple-600">
          <FaUser /> Profile
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-purple-600">
          <FaClipboardList /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-purple-600">
          <FaComments /> AI Interviewer
        </a>
      </nav>
      <div className="absolute bottom-10 left-5">
        <button className="flex items-center gap-3 text-red-500" onClick={closeSidebar}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
