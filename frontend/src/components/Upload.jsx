import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('pdf');
  const fileInputRef = useRef(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for loading

  const redirectToHome = () => {
    navigate('/');
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    toast.success(`📄 File "${selectedFile.name}" selected`);
  }

  const handleUpload = async () => {
    if (!file || !description.trim()) {
      toast.error('Please select a file and enter a job description');
      return;
    }
    
    setIsUploading(true); // Start the loading state
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', description);

    try {
      const response = await axios.post('https://resumeanalyser-x87w.onrender.com/api/v1/analyze/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.success) {
        setIsUploaded(true);
      }

      toast.success(`${response.data.message}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false); // End the loading state
    }
  }

  const handleRemoveFile = () => {
    toast.error(`File "${file.name}" removed.`);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  const handleGenerate = async () => {
    try {
      const response = await axios.get('https://resumeanalyser-x87w.onrender.com/api/v1/insights/generate-insights', {
        withCredentials: true
      });
  
      // Handle success
      if (response.data.success) {
        toast.success('AI-generated analysis available!');
        navigate('/result'); // Navigate to the result page if the analysis is successful
      } else {
        toast.error('Failed to generate analysis. Please try again.');
      }
  
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('An error occurred while generating the analysis. Please try again later.');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      <nav className="bg-white px-6 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1
          className="md:text-3xl text-lg font-extrabold tracking-wide text-purple-700 cursor-pointer"
          onClick={redirectToHome}
        >
          Resume Analyzer AI
        </h1>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 sm:px-8 py-6 sm:py-12">
        <h2 className="md:text-4xl text-3xl font-extrabold leading-tight mb-6 text-gray-800">
          Upload Your Resume for AI-Powered Analysis
        </h2>
        <p className="md:text-lg text-md mb-10 max-w-2xl text-gray-600">
          Upload your resume and job description to get insights on how well they match.
        </p>

        {/* Job Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full max-w-xl bg-white text-black p-4 rounded-md shadow-md mb-4"
          rows={6}
        />

        {/* Upload Section */}
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Upload Your Resume</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept={fileType === 'pdf' ? '.pdf' : '.doc,.docx'}
            onChange={handleFileChange}
            className="bg-white text-black px-4 py-2 rounded-md cursor-pointer shadow-md hover:bg-gray-100 transition w-full sm:w-auto"
          />
          {file && (
            <button
              onClick={handleRemoveFile}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition mt-4 sm:mt-0"
            >
              <X size={16} /> Remove File
            </button>
          )}
        </div>

        {file && (
          <div className="mt-2 bg-white text-black px-4 py-2 rounded-md shadow-md max-w-xs w-full truncate text-sm font-medium">
            {file.name}
          </div>
        )}

        {/* Upload / Generate Button with Loading Animation */}
        <button
          onClick={isUploaded ? handleGenerate : handleUpload}
          disabled={!file || isUploading} // Disable when uploading
          className={`mt-6 px-6 py-2 rounded-md font-semibold transition ${
            isUploading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : isUploaded
              ? 'bg-green-500 hover:bg-green-400 text-white'
              : file
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-400 text-white cursor-not-allowed'
          } w-full sm:w-auto`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              </svg>
              Uploading...
            </div>
          ) : isUploaded ? (
            'Generate Resume Analysis using AI'
          ) : (
            'Upload Resume'
          )}
        </button>
      </section>

    </div>
  );
}
