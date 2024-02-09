import React, { useState } from 'react' //useRef removed temp
import Grid from '@mui/material/Grid'
import './UnionAgreement.css'
import UploadPDF from './UploadComponents/UploadPDF'
import EditPDF from './UploadComponents/EditPDF'

const UnionAgreement = () => {
  // const [agreements, setAgreements] = useState([
  //   { date: '13 June 2023', title: 'Example Agreement 1' },
  //   { date: '26 December 2023', title: 'Example Agreement 2' },s
  //   { date: '01 March 2023', title: 'Example Agreement 3' }
  // ])
  const [agreements, setAgreements] = useState([])
  const [editIndex, setEditIndex] = useState(-1)

  const handleUpload = ({ file, filename, date }) => {
    const uploadedFile = { file, filename, date }
    setAgreements([...agreements, uploadedFile])
  }

  const handleRemove = (index) => {
    const newFiles = [...agreements]
    newFiles.splice(index, 1)
    setAgreements(newFiles)
  }

  const handleEdit = (index) => {
    setEditIndex(index)
  }

  const handleSaveEdit = (index, newFilename, newDate) => {
    const updatedFiles = [...agreements]
    updatedFiles[index].filename = newFilename
    updatedFiles[index].date = newDate
    setAgreements(updatedFiles)
    setEditIndex(-1)
  }

  const handleCancelEdit = () => {
    setEditIndex(-1)
  }

  const handleDownload = (file) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = file.name
    link.click()
  }

  return (
    <div className='union-container'>
      <h2>Union Agreements</h2>
      <div className='uploadrow'>{sessionStorage.getItem('user_type') == 1 && <UploadPDF onUpload={handleUpload} />}</div>
      <div className='agreement-list'>
        {agreements.map((uploadedFile, index) => (
          <Grid container spacing={2} key={index} justifyContent='center' alignItems='center' className='agreement-row'>
            <Grid item xs={3}>
              <p>{uploadedFile.filename}</p>
            </Grid>
            <Grid item xs={2}>
              <h4>{uploadedFile.date}</h4>
            </Grid>
            <Grid item xs={1}>
              {sessionStorage.getItem('user_type') == 1 && <button onClick={() => handleEdit(index)}>Edit</button>}
              {editIndex === index && (
                <EditPDF
                  initialFilename={uploadedFile.filename}
                  initialDate={uploadedFile.date}
                  onSave={(newFilename, newDate) => handleSaveEdit(index, newFilename, newDate)}
                  onClose={handleCancelEdit} // Use onClose instead of onCancel
                />
              )}
            </Grid>
            <Grid item xs={1.5}>
              {sessionStorage.getItem('user_type') == 1 && (
                <button className='btn remove' onClick={() => handleRemove(index)}>
                  Remove
                </button>
              )}
            </Grid>
            <Grid item xs={1.5}>
              <button onClick={() => handleDownload(uploadedFile)}>Download</button>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  )
}

export default UnionAgreement
