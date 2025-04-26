import React, { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()

  const analysis = {
    "matchingScore": 85,
    "skillGapAnalysis": ["Skill1", "Skill2"],
    "sectionWiseAnalysis": { "Education": "Good", "Experience": "Needs Improvement" },
    "overallAnalysis": "Resume is a strong fit but could improve work experience section."
  }

  const pdfRef = useRef()

  const handleDownloadPDF = async () => {
    const element = pdfRef.current
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4') // portrait, millimeters, A4 size

    // Calculate width and height to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('resume_analysis.pdf')
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 text-white">
        <p className="text-xl mb-4">No analysis data found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white text-blue-800 rounded-md font-semibold"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-purple-800 text-white p-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:underline"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold"
        >
          <Download size={18} /> Download as PDF
        </button>
      </div>

      <div
        ref={pdfRef}
        className="bg-white text-black rounded-lg shadow-md p-6 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Resume Analysis Report</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Matching Score</h2>
          <p className="text-xl">{analysis.matchingScore}%</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Skill Gap Analysis</h2>
          <ul className="list-disc list-inside">
            {analysis.skillGapAnalysis.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Section-wise Analysis</h2>
          <div className="space-y-2">
            {Object.entries(analysis.sectionWiseAnalysis).map(([section, feedback], idx) => (
              <div key={idx} className="bg-gray-100 rounded p-3">
                <p className="font-semibold">{section}</p>
                <p className="text-gray-700">{feedback}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Overall Feedback</h2>
          <p className="text-gray-700">{analysis.overallAnalysis}</p>
        </div>
      </div>
    </div>
  )
}
