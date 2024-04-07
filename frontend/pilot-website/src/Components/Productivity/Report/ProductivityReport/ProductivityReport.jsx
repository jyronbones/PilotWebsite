import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import './ProductivityReport.css'

const API_URL = process.env.REACT_APP_API_URL

const ProductivityReport = ({ year }) => {
  ProductivityReport.propTypes = {
    year: PropTypes.number.isRequired
  }

  const [availability, setAvailability] = useState(0)
  const [assignmentSummary, setAssignmentSummary] = useState(0)
  const [productivitySupp, setProductivitySupp] = useState({})
  const [edit, setEdit] = useState(false)
  const [dailyRate, setDailyRate] = useState(0)
  const [monthlyRate, setMonthlyRate] = useState(0)

  useEffect(() => {
    fetchAvailability()
    fetchAssignmentSummary()
    fetchProdSupport()
  }, [])

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`${API_URL}/get-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setAvailability(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const fetchAssignmentSummary = async () => {
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

  const fetchProdSupport = async () => {
    try {
      const response = await fetch(`${API_URL}/get-prodsupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setProductivitySupp(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleUpdateRate = async (daily_rate, monthly_rate, productive_assignments, total) => {
    try {
      const response = await fetch(`${API_URL}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year, daily_rate, monthly_rate, productive_assignments, total })
      })

      if (response.ok) {
        fetchProdSupport()
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
              if (!edit)
                handleUpdateRate(
                  dailyRate,
                  monthlyRate,
                  assignmentSummary.total_assignments - availability.threshold,
                  assignmentSummary.total
                )
              setEdit(!edit)
            }}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      <div className='table-container'>
        <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
          <table className='prodreport-table'>
            <tr>
              <th>Average number of effective pilots</th>
              <td>{availability.total_effective}</td>
            </tr>
            <tr>
              <th>Prouctivity Threshold</th>
              <td>{availability.threshold}</td>
            </tr>
            <tr>
              <th>Total Number of Assignments</th>
              <td>{assignmentSummary.total_assignments}</td>
            </tr>
            <tr>
              <th>Productive Assignments</th>
              <td>
                {assignmentSummary.total_assignments - availability.threshold < 0
                  ? 0
                  : assignmentSummary.total_assignments - availability.threshold}
              </td>
            </tr>
            <tr>
              <th>{`${year} Rate (Daily Rate x 2)`}</th>
              <td>{productivitySupp.daily_rate}</td>
            </tr>
            <tr>
              <th>Total Sum Accummulated</th>
              <td>{productivitySupp.sum_accummlated}</td>
            </tr>
            <tr>
              <th>Share Value</th>
              <td>{productivitySupp.shared_value}</td>
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
                  onChange={(e) => setDailyRate(e.target.value)}
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
                  onChange={(e) => setMonthlyRate(e.target.value)}
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

export default ProductivityReport
