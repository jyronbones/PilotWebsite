import React, { useState, useRef } from 'react'
import { Grid } from '@material-ui/core'
import './UnionAgreement.css'

const UnionAgreement = () => {
  const [agreements, setAgreements] = useState([
    { date: '13 June 2023', title: 'Example Agreement 1' },
    { date: '26 December 2023', title: 'Example Agreement 2' },
    { date: '01 March 2023', title: 'Example Agreement 3' }
  ])
  const hiddenFileInput = useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  // const addAgreement = () => {
  //   // Placeholder for admin check
  //   // if (!isAdmin) return;

  //   const agreement = window.prompt('Enter the union agreement:')
  //   if (agreement) {
  //     setAgreements([...agreements, agreement])
  //   }
  // }

  const editAgreement = (index) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const updatedAgreement = window.prompt('Edit the union agreement:', agreements[index])
    if (updatedAgreement) {
      const newAgreements = [...agreements]
      newAgreements[index] = updatedAgreement
      setAgreements(newAgreements)
    }
  }

  const deleteAgreement = (index) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    if (window.confirm('Are you sure you want to delete this agreement?')) {
      const newAgreements = [...agreements]
      newAgreements.splice(index, 1)
      setAgreements(newAgreements)
    }
  }

  return (
    <div className='union-container'>
      <h2>Union Agreements</h2>
      <div className='agreement-list'>
        {agreements.map((agreement, index) => (
          <Grid container spacing={2} key={index} justifyContent='center' alignItems='center' className='agreement-row'>
            <Grid item xs={3}>
              <p>{agreement.date}</p>
            </Grid>
            <Grid item xs={5}>
              <h4>{agreement.title}</h4>
              {/* Example CRUD buttons for each minute */}
            </Grid>
            <Grid item xs={1}>
              <button onClick={() => editAgreement(index)}>Edit</button>
            </Grid>
            <Grid item xs={1}>
              <button onClick={() => deleteAgreement(index)}>Delete</button>
            </Grid>
          </Grid>
        ))}
      </div>
      <button className='btn-add-agreement' onClick={handleClick}>
        Add Agreement
        <input type='file' ref={hiddenFileInput} style={{ display: 'none' }} />
      </button>
    </div>
  )
}

export default UnionAgreement
