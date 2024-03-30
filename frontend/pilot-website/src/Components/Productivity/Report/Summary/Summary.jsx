import React, { useState, useEffect } from 'react'
import './Summary.css'

const API_URL = process.env.REACT_APP_API_URL

const Summary = () => {
  const [summary, setSummary] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
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
    <div className='table-container'>
      <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
        <table className='summary-table'>
          <tr>
            <th>Full Trips</th>
            <td>{summary.total_full}</td>
            <th>Daily Rate</th>
            <td>$10</td>
          </tr>
          <tr>
            <th>Divide by 2</th>
            <td>{summary.half_full}</td>
            <th>Days</th>
            <td>1</td>
          </tr>
          <tr>
            <th>Partial Trips</th>
            <td>{summary.total_partial}</td>
            <th>Monthly Rate</th>
            <td>$10000</td>
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
        </table>
      </section>
    </div>
  )
}

export default Summary
