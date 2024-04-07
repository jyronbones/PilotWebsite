import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import './Summary.css'

const API_URL = process.env.REACT_APP_API_URL

const Summary = ({ year }) => {
  Summary.propTypes = {
    year: PropTypes.number.isRequired
  }

  const [assignmentSummary, setAssignmentSummary] = useState([])

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/assignment-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setAssignmentSummary(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <div className='table-container'>
        <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
          <table className='summary-table'>
            <tr>
              <th>Full Trips</th>
              <td>{assignmentSummary.total_full}</td>
            </tr>
            <tr>
              <th>Divide by 2</th>
              <td>{assignmentSummary.half_full}</td>
            </tr>
            <tr>
              <th>Partial Trips</th>
              <td>{assignmentSummary.total_partial}</td>
            </tr>
            <tr>
              <th>Cancellations</th>
              <td>{assignmentSummary.total_cancel}</td>
            </tr>
            <tr>
              <th>Dbl Assignments</th>
              <td>{assignmentSummary.total_double}</td>
            </tr>
            <tr>
              <th>Productivity</th>
              <td>{assignmentSummary.total_assignments}</td>
            </tr>
          </table>
        </section>
      </div>
    </div>
  )
}

export default Summary
