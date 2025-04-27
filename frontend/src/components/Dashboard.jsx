import React, { useState } from 'react';
import Header from '../layouts/Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const Dashboard = () => {
    const userState = useSelector((state) => state.user);
    const { user, isAuthenticated, loading } = userState;
    const navigate = useNavigate();
    const [selectedResume, setSelectedResume] = useState(null);

    const cloudName = "dklot0q6w"; // Your actual Cloudinary cloud name

    if (!isAuthenticated) {
        navigate("/login");
    }

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    const handleCardClick = (resume) => {
        setSelectedResume(resume);
    };

    const closeSidebar = () => {
        setSelectedResume(null);
    };

    const getPreviewUrl = (fileUrl) => {
        return `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,c_fit,fl_attachment/${fileUrl}.jpg`;
    };

    // Helper function to clean text
    const cleanText = (text) => {
        if (!text) return "";
        const lines = text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        return lines.map(line => `• ${line}`).join('\n\n');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 relative">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header user={user} />


                {/* Content */}
                <div className="px-4 sm:px-6 md:px-8 mt-24 max-w-7xl mx-auto w-full mb-10">
                <h3 className="text-3xl font-bold mb-5">Welcome <span className=' text-purple-600'>{user?.name}</span>,</h3>
                    <h3 className="text-xl font-semibold mb-6">Old Resumes</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Dynamically load resumes */}
                        {user?.resumes?.length > 0 ? (
                            user?.resumes?.map((resume, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-3 hover:shadow-md cursor-pointer w-full"
                                    onClick={() => handleCardClick(resume)}
                                >
                                    <img
                                        src={getPreviewUrl(resume.fileid)}
                                        alt={`Resume Preview ${index + 1}`}
                                        className="w-full aspect-[8/11] object-cover mb-5 rounded"
                                    />
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">{`Resume ${index + 1}`}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full border-4 border-dotted rounded-lg p-8 text-center bg-gray-50 text-gray-800">
            <p className="text-xl font-semibold mb-4">No Resumes Found</p>
            <p className="mb-6 text-lg">It looks like you don’t have any resumes uploaded yet.</p>
            <button
                onClick={() => navigate('/upload')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
            >
                Create New Resume
            </button>
        </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Sidebar Drawer for Resume Details */}
            {selectedResume && (
                <div className="fixed top-0 right-0 w-full md:w-1/2 bg-white shadow-lg h-full overflow-y-scroll transition-all duration-300 z-50">
                    {/* Fixed Header */}
                    <div className="sticky top-0 left-0 w-full bg-white shadow-lg z-50">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-xl font-bold text-purple-600">Resume Details</h3>
                            <button onClick={closeSidebar} className="text-gray-600 hover:text-gray-900">
                                <FaTimes size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content below the fixed header */}
                    <div className="p-5 space-y-8 overflow-y-auto mt-0">

                        {/* Job Description */}
                        {selectedResume.jobDescription && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Job Description</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.jobDescription)}</p>
                            </div>
                        )}

                        {/* Resume Image */}
                        {selectedResume.fileid && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Resume</h4>
                                <img
                                    src={getPreviewUrl(selectedResume.fileid)}
                                    alt="Resume Preview"
                                    className="w-full aspect-[8/11] object-cover mb-4 rounded"
                                />

                                {/* 🌟 Added Download Button here */}
                                <a
                                    href={`https://res.cloudinary.com/${cloudName}/image/upload/${selectedResume.fileid}`}
                                    download={`Resume_${selectedResume.fileid}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mt-4"
                                >
                                    Download Resume
                                </a>
                            </div>
                        )}

                        {/* Education */}
                        {selectedResume.education && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Education</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.education)}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {selectedResume.experience && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Experience</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.experience)}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {selectedResume.skills && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Skills</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.skills)}</p>
                            </div>
                        )}

                        {/* Projects */}
                        {selectedResume.projects && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Projects</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.projects)}</p>
                            </div>
                        )}

                        {/* Achievements */}
                        {selectedResume.achievements && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Achievements</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.achievements)}</p>
                            </div>
                        )}

                        {/* Certifications */}
                        {selectedResume.certifications && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Certifications</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.certifications)}</p>
                            </div>
                        )}

                        {/* Summary */}
                        {selectedResume.summary && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-purple-700">Summary</h4>
                                <p className="text-gray-700 whitespace-pre-line">{cleanText(selectedResume.summary)}</p>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
