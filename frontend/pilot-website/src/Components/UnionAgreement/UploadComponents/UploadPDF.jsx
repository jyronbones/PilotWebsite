// UploadPDF.js
import React, { useState, useCallback } from 'react'
import Modal from 'react-modal'
import './UploadPDF.css'

const customModalStyles = {
  content: {
    width: '500px',
    height: '250px',
    margin: 'auto'
  }
}

const UploadPDF = () => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setFile(null)
    setFilename('')
    setModalOpen(false)
  }

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
  }

  const handleUpload = () => {
    closeModal()
    if (file) {
      // You can perform any additional logic here before uploading the file
      console.log('File:', file)
      console.log('Filename:', filename)
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
      <button onClick={openModal}>Open File Dialog</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='File Upload Modal'
        style={customModalStyles}
        portalClassName='modal-portal'
      >
        {file ? (
          <div>
            <p>Dragged file: {filename}</p>
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
        {file && <button onClick={handleUpload}>Upload PDF</button>}
        {!file && (
          <label>
            <br />
            Or choose a PDF file:
            <input type='file' onChange={handleFileInput} />
          </label>
        )}
        <button className='close-button' onClick={closeModal}>
          x
        </button>
      </Modal>
    </div>
  )
}

export default UploadPDF
