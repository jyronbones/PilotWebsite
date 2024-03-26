import React, { useState, useEffect } from 'react'
import './MeetingMinutes.css'
import UploadPDF from './UploadComponents/UploadPDF'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const MeetingMinutes = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetchFiles()
  }, []) //files

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await axios.delete(`${API_URL}/delete-meeting/${filename}`)
        setFiles(files.filter((file) => file.filename !== filename))
      } catch (error) {
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`${API_URL}/download-meeting/${filename}`, {
        responseType: 'blob' // Important: responseType must be 'blob' for file download
      })

      // Create a temporary URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // Create a temporary link element and click it to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      // Clean up the temporary URL and link element
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading meeting:', error)
    }
  }

  const handleUpload = () => {
    // Call fetchFiles after successful upload
    fetchFiles()
  }

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/list-meetings`)
      setFiles(response.data.files)
    } catch (error) {
      console.error('Error listing meetings from S3:', error)
      setFiles([])
    }
  }

  return (
    <>
      <div className='meeting-container'>
        <h2>Meeting Minutes</h2>
        <div className='p-2 p-md-4'>
          {sessionStorage.getItem('user_type') == 1 && (
            <div className='create-btn'>
              <UploadPDF onUpload={handleUpload} />
            </div>
          )}

          <div className='meeting-table-container'>
            <section className='scroll-section pt-3 table-main table-responsive' id='hoverableRows'>
              <table className='custom-meeting-table'>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Date Uploaded</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files?.length > 0 ? (
                    <>
                      {files.map((file, index) => (
                        <tr key={index}>
                          <td>{file.filename.split('.').slice(0, -1).join('.')}</td>
                          <td>{file.dateAdded}</td>
                          <td>{file.category}</td>
                          <td>
                            <div className='action-container'>
                              {sessionStorage.getItem('user_type') == 1 && (
                                <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                  Delete
                                </button>
                              )}
                              <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={3}>No Meeting Minutes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default MeetingMinutes
