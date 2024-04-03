import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import TextField from '@mui/material/TextField'
import './Summary.css'

const API_URL = process.env.REACT_APP_API_URL

const Summary = ({ year }) => {
  Summary.propTypes = {
    year: PropTypes.number.isRequired
  }

  const [summary, setSummary] = useState([])
  const [edit, setEdit] = useState(false)
  const [dailyRate, setDailyRate] = useState(0)
  const [monthlyRate, setMonthlyRate] = useState(0)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <div className='btn actions'>
        {sessionStorage.getItem('user_type') == 1 && (
          <button
            className='btn create'
            onClick={() => {
              setEdit(!edit)
            }}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      <div className='table-container'>
        <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
          <table className='summary-table'>
            <tr>
              <th>Full Trips</th>
              <td>{summary.total_full}</td>
            </tr>
            <tr>
              <th>Divide by 2</th>
              <td>{summary.half_full}</td>
            </tr>
            <tr>
              <th>Partial Trips</th>
              <td>{summary.total_partial}</td>
            </tr>
            <tr>
              <th>Cancellations</th>
              <td>{summary.total_cancel}</td>
            </tr>
            <tr>
              <th>Dbl Assignments</th>
              <td>{summary.total_double}</td>
            </tr>
            <tr>
              <th>Productivity</th>
              <td>{summary.total_assignments}</td>
            </tr>
            <tr>
              <th>Daily Rate</th>
              {edit ? (
                <TextField
                  className='daily-rate'
                  id='outlined-basic'
                  type='number'
                  label='Daily Rate'
                  variant='outlined'
                  size='small'
                  sx={{
                    width: 100
                  }}
                  onChange={(e) => {
                    setDailyRate(e.target.value)
                  }}
                />
              ) : (
                <td>${dailyRate}</td>
              )}
            </tr>
            <tr>
              <th>Days</th>
              <td>1</td>
            </tr>
            <tr>
              <th>Monthly Rate</th>
              {edit ? (
                <TextField
                  className='monthly-rate'
                  id='outlined-basic'
                  type='number'
                  label='Monthly Rate'
                  variant='outlined'
                  size='small'
                  onChange={(e) => {
                    setMonthlyRate(e.target.value)
                  }}
                  sx={{
                    width: 140
                  }}
                />
              ) : (
                <td>${monthlyRate}</td>
              )}
            </tr>
          </table>
        </section>
      </div>
    </div>
  )
}

export default Summary
