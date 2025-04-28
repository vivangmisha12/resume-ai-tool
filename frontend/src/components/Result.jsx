import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Register necessary chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Result = () => {
  const [userData, setUserData] = useState(null);
  const [geminiData, setGeminiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data and pass it to Gemini API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://resumeanalyser-x87w.onrender.com/api/v1/user/auth/me', { withCredentials: true });

        if (response.data.success) {
          setUserData(response.data.data);

          // Initialize Gemini model
          const model = new GoogleGenerativeAI({
            apiKey: 'AIzaSyCilfMz7c33yA4TBhaLrKO4OpLwrAauiDs' // Pass your API key here
          }).getGenerativeModel({ model: "gemini-1.5-flash" });

          // Log model to inspect its methods
          console.log(model);
          console.log(Object.getOwnPropertyNames(model));

          // Uncomment below to call Gemini API for analysis
          // const geminiResponse = await model.generate({
          //   prompt: generateGeminiPrompt(response.data.data.resumes),
          // });

          // if (geminiResponse) {
          //   setGeminiData(geminiResponse);
          // } else {
          //   toast.error('Failed to fetch Gemini analysis');
          // }
        } else {
          toast.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data or Gemini analysis:', error);
        toast.error('An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to generate prompt for Gemini
  const generateGeminiPrompt = (lastResume) => {
    const resumeData = `
      Education: ${lastResume?.sectionWiseAnalysis?.Education || 'No data'}
      Experience: ${lastResume?.sectionWiseAnalysis?.Experience || 'No data'}
      Skills: ${lastResume?.sectionWiseAnalysis?.Skills || 'No data'}
      Projects: ${lastResume?.sectionWiseAnalysis?.Projects || 'No data'}
      Certifications: ${lastResume?.sectionWiseAnalysis?.Certifications || 'No data'}
      Achievements: ${lastResume?.sectionWiseAnalysis?.Achievements || 'No data'}
    `;

    return `Analyze the following resume and provide insights:\n\n${resumeData}`;
  };

  // Helper function to get the most recent resume
  const getLastResume = () => {
    return userData?.resumes?.[userData.resumes.length - 1] || null;
  };

  // Prepare skill gap data for the pie chart
  const getSkillGapData = () => {
    const lastResume = getLastResume();
    if (!lastResume || !lastResume.skillGapAnalysis) return [];

    const { skillGapAnalysis } = lastResume;
    const missing = skillGapAnalysis?.missingSkills?.length || 0;
    const partiallyMatching = skillGapAnalysis?.partiallyMatchingSkills?.length || 0;
    const strongMatching = skillGapAnalysis?.strongMatchingSkills?.length || 0;

    return {
      labels: ['Missing Skills', 'Partially Matching Skills', 'Strong Matching Skills'],
      datasets: [{
        data: [missing, partiallyMatching, strongMatching],
        backgroundColor: ['#ff0000', '#ffcc00', '#00cc00'],
        borderColor: ['#ff0000', '#ffcc00', '#00cc00'],
        borderWidth: 1
      }]
    };
  };

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

  // Function to download PDF
  const downloadPDF = () => {
    console.log("Download PDF button clicked");
  
    const doc = new jsPDF();
    const margin = 14;
    let currentY = margin; // Track the current vertical position
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const availableWidth = pageWidth - margin * 2;
  
    // Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Resume Analysis Report', margin, currentY + 10);
    currentY += 20;
  
    // Generated Date
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), margin, currentY);
    currentY += 15;
  
    const lastResume = getLastResume();
  
    // Job Description
    const jobDescription = lastResume.jobDescription || 'No job description provided';
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Job Description', margin, currentY);
    currentY += 10;

    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const wrappedText = doc.splitTextToSize(jobDescription, availableWidth);
    doc.text(wrappedText, margin, currentY);
    currentY += wrappedText.length * 6 + 5; // Move based on number of lines
    
    const matchingScore = lastResume.matchingScore;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Matching Score', margin, currentY);
    currentY += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const wt = doc.splitTextToSize(matchingScore, availableWidth);
    doc.text(wt, margin, currentY);
    currentY += wt.length * 6 + 5; // Move based on number of lines

    // Matching Score
    if (lastResume) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Matching Score', margin, currentY);
      currentY += 10;
  
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Matching Score: ${lastResume.matchingScore || 'No score available'}`, margin, currentY);
      currentY += 15;
    }
  
    // Skill Gap Analysis
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Skill Gap Analysis', margin, currentY);
    currentY += 10;
  
    const skillGapData = getSkillGapData();
  
    const skillsTable = [
      ['Category', 'Skills'],
      ['Missing Skills', skillGapData.datasets[0].data[0]],
      ['Partially Matching Skills', skillGapData.datasets[0].data[1]],
      ['Strong Matching Skills', skillGapData.datasets[0].data[2]]
    ];
  
    doc.autoTable({
      head: [skillsTable[0]],
      body: skillsTable.slice(1),
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
      margin: { left: 15, right: 15 },
    });
  
    currentY = doc.lastAutoTable.finalY + 10; // Update after table
  
    // Section-Wise Analysis
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Section-Wise Analysis', margin, currentY);
    currentY += 10;
  
    const sectionWiseAnalysis = lastResume.sectionWiseAnalysis || {};
    const sectionData = [
      ['Education', sectionWiseAnalysis.Education || 'No data'],
      ['Experience', sectionWiseAnalysis.Experience || 'No data'],
      ['Skills', sectionWiseAnalysis.Skills || 'No data'],
      ['Projects', sectionWiseAnalysis.Projects || 'No data'],
      ['Certifications', sectionWiseAnalysis.Certifications || 'No data'],
      ['Achievements', sectionWiseAnalysis.Achievements || 'No data']
    ];
  
    doc.autoTable({
      head: [['Section', 'Details']],
      body: sectionData,
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' } },
      margin: { left: 15, right: 15 },
    });
  
    currentY = doc.lastAutoTable.finalY + 10; // Update after table
  
    // Chart + Overall Analysis
    if (chartRef.current) {
      setTimeout(() => {
        if (chartRef.current && chartRef.current.offsetHeight > 0) {
          console.log("Chart is visible, capturing...");
  
          html2canvas(chartRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', margin, currentY, 180, 100);
  
            currentY += 110; // Move down after chart
  
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Overall Analysis', margin, currentY);
            currentY += 10;
  
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(12);
            const overallAnalysis = lastResume.overallAnalysis || 'No overall analysis available';
            const wrappedOverall = doc.splitTextToSize(overallAnalysis, availableWidth);
            doc.text(wrappedOverall, margin, currentY);
  
            // Save final PDF
            doc.save('resume_analysis.pdf');
          });
        } else {
          doc.save('resume_analysis.pdf');
        }
      }, 500); 
    } else {
      doc.save('resume_analysis.pdf');
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />

      <nav className="bg-white px-6 sm:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1
          className="md:text-3xl text-lg font-extrabold tracking-wide text-purple-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Resume Analyzer AI
        </h1>
      </nav>

      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 sm:px-8 py-6 sm:py-12">
        <h2 className="md:text-4xl text-3xl font-extrabold leading-tight mb-6 text-gray-800">
          Resume Analysis Results
        </h2>

        {userData?.resumes?.length > 0 && (
          <div className="w-full max-w-xl text-left mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Matching Score</h3>
            <p className="text-lg text-gray-600">
              Matching Score: {getLastResume()?.matchingScore || 'No score available'}
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-4">Skill Gap Analysis</h3>
            <ul className="text-lg text-gray-600">
              <li><strong>Missing Skills:</strong> {getLastResume()?.skillGapAnalysis?.missingSkills?.join(', ') || 'None'}</li>
              <li><strong>Partially Matching Skills:</strong> {getLastResume()?.skillGapAnalysis?.partiallyMatchingSkills?.join(', ') || 'None'}</li>
              <li><strong>Strong Matching Skills:</strong> {getLastResume()?.skillGapAnalysis?.strongMatchingSkills?.join(', ') || 'None'}</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-800 mt-4">Section-Wise Analysis</h3>
            <ul className="text-lg text-gray-600">
              <li><strong>Education:</strong> {getLastResume()?.sectionWiseAnalysis?.Education || 'No data'}</li>
              <li><strong>Experience:</strong> {getLastResume()?.sectionWiseAnalysis?.Experience || 'No data'}</li>
              <li><strong>Skills:</strong> {getLastResume()?.sectionWiseAnalysis?.Skills || 'No data'}</li>
              <li><strong>Projects:</strong> {getLastResume()?.sectionWiseAnalysis?.Projects || 'No data'}</li>
              <li><strong>Certifications:</strong> {getLastResume()?.sectionWiseAnalysis?.Certifications || 'No data'}</li>
              <li><strong>Achievements:</strong> {getLastResume()?.sectionWiseAnalysis?.Achievements || 'No data'}</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-800 mt-4">Overall Analysis</h3>
            <p className="text-lg text-gray-600">{getLastResume()?.overallAnalysis || 'No overall analysis available'}</p>
          </div>
        )}

        {/* Skill Gap Analysis - Pie Chart */}
        {userData?.resumes?.length > 0 && (
          <div className="w-full max-w-xs mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Skill Gap Analysis (Pie Chart)</h3>
            <Pie 
              ref={chartRef}  // Referencing the chart
              data={getSkillGapData()} 
              options={{ responsive: true }} 
            />
          </div>
        )}

        {/* Display Gemini Analytics if available */}
        {geminiData && (
          <div className="w-full max-w-xl text-left mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Gemini Analytical Insights</h3>
            <pre className="text-lg text-gray-600">{JSON.stringify(geminiData, null, 2)}</pre>
          </div>
        )}

        {/* Button to trigger PDF download */}
        <button
          onClick={downloadPDF}
          className="bg-purple-700 text-white text-xl px-6 py-3 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
        >
          Download Resume Analysis PDF
        </button>
        <button
          onClick={handleGenerate}
          className="bg-purple-700 text-white text-xl mt-5 px-6 py-3 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
        >
          Regenerate Analysis
        </button>
      </section>
    </div>
  );
};

export default Result;
