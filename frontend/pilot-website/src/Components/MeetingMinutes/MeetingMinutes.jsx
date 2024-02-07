import React, { useState, useRef } from 'react'
import { Grid } from '@mui/material'
import './MeetingMinutes.css'

const MeetingMinutes = () => {
  const [minutes, setMinutes] = useState([
    {
      id: 1,
      title: 'Meeting on Project A',
      content: 'Discussed the progress on Pilot Website...'
    },
    {
      id: 2,
      title: 'Review Meeting',
      content: 'Tested meeting minute functionality...'
    }
    // ... other initial minutes
  ])
  const hiddenFileInput = useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  // const addMinute = () => {
  //   // Placeholder for admin check
  //   // if (!isAdmin) return;
  //   const title = window.prompt('Enter the title for the meeting minute:')
  //   const content = window.prompt('Enter the content for the meeting minute:')
  //   if (title && content) {
  //     const newMinute = { id: Date.now(), title, content } // Using timestamp as a makeshift id
  //     setMinutes([...minutes, newMinute])
  //   }
  // }

  const editMinute = (id) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const minute = minutes.find((m) => m.id === id)
    const newTitle = window.prompt('Edit the title:', minute.title)
    const newContent = window.prompt('Edit the content:', minute.content)

    if (newTitle && newContent) {
      const updatedMinutes = minutes.map((m) => (m.id === id ? { ...m, title: newTitle, content: newContent } : m))
      setMinutes(updatedMinutes)
    }
  }

  const deleteMinute = (id) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    if (window.confirm('Are you sure you want to delete this minute?')) {
      const updatedMinutes = minutes.filter((m) => m.id !== id)
      setMinutes(updatedMinutes)
    }
  }

  return (
    <div className='minutes-container'>
      <h2>Meeting Minutes</h2>
      <div className='minute-list'>
        {minutes.map((minute) => (
          <Grid container spacing={2} key={minute.id} justifyContent='center' alignItems='center' className='minute-row'>
            <Grid item xs={3}>
              <h3>{minute.title}</h3>
            </Grid>
            <Grid item xs={5}>
              <p>{minute.content}</p>
              {/* Example CRUD buttons for each minute */}
            </Grid>
            <Grid item xs={1}>
              <button className='btn edit' onClick={() => editMinute(minute.id)}>
                Edit
              </button>
            </Grid>
            <Grid item xs={1}>
              <button className='btn delete' onClick={() => deleteMinute(minute.id)}>
                Delete
              </button>
            </Grid>
          </Grid>
        ))}
      </div>
      <div className='btn-minute'>
        <button className='btn add-minute' onClick={handleClick}>
          Add Manually
        </button>
        <button className='btn add-minute' onClick={handleClick}>
          Upload File
          <input type='file' ref={hiddenFileInput} style={{ display: 'none' }} />
        </button>
      </div>
    </div>
  )
}

export default MeetingMinutes
