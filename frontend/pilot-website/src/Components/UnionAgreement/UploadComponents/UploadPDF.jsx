import React, { useState } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './UploadPDF.css'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const customModalStyles = {
  content: {
    width: '500px',
    height: '400px',
    margin: 'auto'
  }
}

const UploadPDF = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [fileType, setFileType] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Union Agreement')
  const [error, setError] = useState('')

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setFile(null)
    setFilename('')
    setIsModalOpen(false)
    setSelectedOption('Union Agreement')
    setError('')
  }

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
    setFileType(selectedFile.name.endsWith('.pdf') ? 'PDF' : 'Unknown')
  }

  const handleFilenameChange = (e) => {
    let newFilename = e.target.value
    if (!newFilename.endsWith('.pdf')) {
      newFilename += '.pdf'
    }
    setFilename(newFilename)
  }
  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file before uploading.')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('filename', filename)
      formData.append('fileType', fileType)
      formData.append('category', selectedOption)

      await axios.post(`${API_URL}/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setError('')
      onUpload()
      closeModal()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      }
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div>
      <button onClick={openModal}>Upload File</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='File Upload Modal'
        style={customModalStyles}
        portalClassName='modal-portal'
      >
        <h2 style={{ fontSize: '100%' }}>Upload file</h2>
        {error && <p className='errorMessage'>{error}</p>}
        {!file && (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleFileChange(e.dataTransfer.files[0])
              }}
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                marginTop: '3rem'
              }}
            >
              <p>Drag and drop your PDF file here</p>
            </div>
            <br />
            <div style={{ marginLeft: '2rem' }}>Or choose a PDF file:</div>
          </div>
        )}

        <div className='modalContainer'>
          {file ? (
            <div className='confirmUpload'>
              <h3>Selected file</h3>
            </div>
          ) : (
            <div></div>
          )}
          <label>
            <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} />
          </label>
          {file ? (
            <div>
              <label>
                <b>File name:</b>
                <div className='filenameTextbox'>
                  <input type='text' value={filename.split('.').slice(0, -1).join('.')} onChange={handleFilenameChange} />
                  <span className='pdfTextbox'>.pdf</span>
                </div>
              </label>
              <label>
                <b>File category:</b>
                <select className='categoryCB' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                  <option value='Union Agreement'>Union Agreement</option>
                  <option value='Corporate Bylaw'>Corporate Bylaws</option>
                  <option value='Working Rules'>Working Rules</option>
                  <option value='Other'>Other</option>
                </select>
              </label>
              <br />
              <button className='upload-button' onClick={handleUpload}>
                Upload PDF
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <button className='close-button' onClick={closeModal}>
          X
        </button>
      </Modal>
    </div>
  )
}

UploadPDF.propTypes = {
  onUpload: PropTypes.func.isRequired
}

export default UploadPDF
