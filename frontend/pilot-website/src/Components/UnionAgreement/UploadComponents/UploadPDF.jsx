import React, { useState } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './UploadPDF.css'
import s3 from '../../../aws-config'

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

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setFile(null)
    setFilename('')
    setIsModalOpen(false)
  }

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
  }

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file before uploading.')
        return
      }

      const params = {
        Bucket: 'awsbucket-files', // Replace with your S3 bucket name
        Key: filename,
        Body: file
      }

      await s3.upload(params).promise()
      onUpload({ file, filename }) // You may pass additional data if needed
      closeModal()
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    handleFileChange(droppedFile)
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    handleFileChange(selectedFile)
  }

  return (
    <div>
      <button onClick={openModal}>Upload PDF</button>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel='File Upload Modal' style={customModalStyles}>
        <h2 style={{ fontSize: '100%' }}>Upload File</h2>
        {file ? (
          <div className='confirmUpload'>
            <h3>Selected File</h3>
            <label>Filename: {filename}</label>
            <button onClick={handleUpload}>Upload</button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
          <div>
            <label>
              Or choose a PDF file:
              <input type='file' onChange={handleFileInput} />
            </label>
          </div>
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
