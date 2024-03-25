import React, { useState } from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import './EditPDF.css'

const customModalStyles = {
  content: {
    width: '400px',
    height: '300px',
    margin: 'auto'
  }
}

const EditPDF = ({ initialFilename, initialDate, onSave, onClose }) => {
  const [filename, setFilename] = useState(initialFilename)
  const [date, setDate] = useState(initialDate)

  const handleSave = () => {
    onSave(filename, date)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={true} contentLabel='Edit PDF Modal' style={customModalStyles}>
      <h2 style={{ fontSize: '100%' }}>Edit file</h2>
      <button className='close-button' onClick={handleClose}>
        X
      </button>
      <label style={{ marginTop: '2rem' }}>Filename:</label>
      <input type='text' value={filename} onChange={(e) => setFilename(e.target.value)} />
      <label>Date:</label>
      <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
      <div className='saveclose-button'>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </Modal>
  )
}

EditPDF.propTypes = {
  initialFilename: PropTypes.string.isRequired,
  initialDate: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default EditPDF
