import React, { useState, useCallback } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './UploadPDF.css'

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
  const [date, setDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFile(null)
    setFilename('')
    setDate('')
  }

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
  }

  const handleUpload = () => {
    if (file) {
      onUpload({ file, filename, date })
      closeModal()
    } else {
      alert('Please select a file before uploading.')
    }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      handleFileChange(droppedFile)
    },
    [handleFileChange]
  )

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    handleFileChange(selectedFile)
  }

  return (
    <div>
      <button className='opendialog-button' onClick={openModal}>
        Upload File
      </button>
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
              <b>Filename:</b>
              <input type='text' value={filename} onChange={(e) => setFilename(e.target.value)} />
            </label>
            <label>
              <b>Date:</b>
              <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <br />
            <button className='upload-button' onClick={handleUpload}>
              Upload PDF
            </button>
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
          <label>
            <br />
            Or choose a PDF file:
            <input type='file' onChange={handleFileInput} />
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
