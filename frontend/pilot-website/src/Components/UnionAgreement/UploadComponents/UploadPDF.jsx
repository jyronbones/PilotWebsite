import React, { useState } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './UploadPDF.css'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const customModalStyles = {
  content: {
    width: '500px',
    height: '350px',
    margin: 'auto'
  }
}

const UploadPDF = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Union Agreement')

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setFile(null)
    setFilename('')
    setIsModalOpen(false)
    setSelectedOption('Union Agreement')
  }

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
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
      formData.append('category', selectedOption)

      await axios.post(`${API_URL}/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onUpload()
      closeModal()
    } catch (error) {
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
        {file ? (
          <div className='confirmUpload'>
            <h3>Selected file</h3>
            <label>
              <b>File name:</b>
              <input type='text' value={filename} onChange={handleFilenameChange} />
            </label>
            <label>
              <b>File category:</b>
              <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
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
        )}
        {!file && (
          <label>
            <br />
            Or choose a PDF file:
            <input type='file' onChange={(e) => handleFileChange(e.target.files[0])} />
          </label>
        )}
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
