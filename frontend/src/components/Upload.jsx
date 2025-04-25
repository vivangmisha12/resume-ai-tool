import React, { useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { X } from 'lucide-react'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('pdf')
  const fileInputRef = useRef(null) // 👈 add a ref

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    toast.success(`📄 File "${selectedFile.name}" selected`)
  }

  const handleUpload = () => {
    if (file) {
      toast.success(`✅ File "${file.name}" uploaded successfully!`)
    }
  }

  const handleRemoveFile = () => {
    toast.error(`❌ File "${file.name}" removed.`)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = null // 👈 reset input field
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-800 to-purple-800 text-white">
      <Toaster position="top-center" reverseOrder={false} />

      <header className="flex justify-between items-center px-6 py-4 bg-white text-black shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">Res-You-Me</h1>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Upload Your Resume</h2>
        <p className="text-lg text-white/80 mb-6">Choose the file type you'd like to upload:</p>

        {/* File type + Remove file in same row */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFileType('pdf')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              fileType === 'pdf' ? 'bg-white text-blue-800' : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            PDF
          </button>
          <button
            onClick={() => setFileType('doc')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              fileType === 'doc' ? 'bg-white text-blue-800' : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            DOC / DOCX
          </button>

          {file && (
            <button
              onClick={handleRemoveFile}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              <X size={16} /> Remove File
            </button>
          )}
        </div>

        {/* File input */}
        <div className="flex items-center gap-4 mb-4">
          <input
            ref={fileInputRef} // 👈 attach the ref here
            type="file"
            accept={fileType === 'pdf' ? '.pdf' : '.doc,.docx'}
            onChange={handleFileChange}
            className="bg-white text-black px-4 py-2 rounded-md cursor-pointer shadow-md hover:bg-gray-100 transition"
          />
        </div>

        {/* File preview */}
        {file && (
          <div className="mt-2 bg-white text-black px-4 py-2 rounded-md shadow-md max-w-xs w-full truncate text-sm font-medium">
            {file.name}
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`mt-6 px-6 py-2 rounded-md font-semibold transition ${
            file ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Upload
        </button>
      </div>
    </div>
  )
}