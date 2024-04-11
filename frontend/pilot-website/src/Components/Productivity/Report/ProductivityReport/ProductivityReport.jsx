import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import './ProductivityReport.css'

const API_URL = process.env.REACT_APP_API_URL

const ProductivityReport = ({ year }) => {
  ProductivityReport.propTypes = {
    year: PropTypes.number.isRequired
  }
  const [effectivePilots, setEffectivePilots] = useState(0)
  const [assignmentSummary, setAssignmentSummary] = useState(0)
  const [productivitySupp, setProductivitySupp] = useState({})
  const [edit, setEdit] = useState(false)
  const [dailyRate, setDailyRate] = useState(0)
  const [monthlyRate, setMonthlyRate] = useState(0)
  const [prodAssign, setProdAssign] = useState(0)

  useEffect(() => {
    fetchAvailability()
    fetchAssignmentSummary()
  }, [])

  useEffect(() => {
    if (assignmentSummary) {
      console.log('assignmentSummary: ', assignmentSummary)
      let productive_assignment =
        Math.round(fetchData.productivity - effectivePilots.threshold < 0 ? 0 : fetchData.productivity - effectivePilots.threshold * 100) /
        100
      let productive_assignments = isNaN(productive_assignment) || productive_assignment === null ? 0 : productive_assignment
      console.log('assignments: ', productive_assignments)
      setProdAssign(productive_assignments)
      fetchProdSupport(productive_assignments, assignmentSummary.total)
    }
  }, [assignmentSummary, effectivePilots])

  useEffect(() => {
    if (productivitySupp) {
      setDailyRate(productivitySupp.daily_rate)
      setMonthlyRate(productivitySupp.monthly_rate)
    }
  }, [productivitySupp])

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`${API_URL}/effective`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setEffectivePilots(data.data)
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

  const fetchProdSupport = async (productive_assignments, total) => {
    try {
      const response = await fetch(`${API_URL}/prodsupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year, productive_assignments, total })
      })

      if (response.ok) {
        const data = await response.json()
        setProductivitySupp(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleUpdateRate = async (daily_rate, monthly_rate, prodAssign, total) => {
    try {
      const response = await fetch(`${API_URL}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year, daily_rate, monthly_rate })
      })

      if (response.ok) {
        fetchProdSupport(prodAssign, total)
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
              if (edit) handleUpdateRate(dailyRate, monthlyRate, isNaN(prodAssign) ? 0 : prodAssign, assignmentSummary.total)
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
            <tbody>
              <tr>
                <th>Average number of effective pilots</th>
                <td>{effectivePilots.total_effective}</td>
              </tr>
              <tr>
                <th>Prouctivity Threshold</th>
                <td>{effectivePilots.threshold}</td>
              </tr>
              <tr>
                <th>Total Number of Assignments</th>
                <td>{assignmentSummary.productivity}</td>
              </tr>
              <tr>
                <th>Productive Assignments</th>
                <td>{isNaN(prodAssign) || prodAssign === null ? 0 : prodAssign}</td>
              </tr>
              <tr>
                <th>{`${year} Rate (Daily Rate x 2)`}</th>
                {productivitySupp && <td>{productivitySupp.daily_rate ? productivitySupp.daily_rate * 2 : 0}</td>}
              </tr>
              <tr>
                <th>Total Sum Accummulated</th>
                {productivitySupp && <td>{productivitySupp.sum_accummulated ? productivitySupp.sum_accummulated : 0}</td>}
              </tr>
              <tr>
                <th>Share Value</th>
                {productivitySupp && <td>{productivitySupp.shared_value ? productivitySupp.shared_value : 0}</td>}
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
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                  />
                ) : (
                  <td>${dailyRate || productivitySupp.daily_rate}</td>
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
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(e.target.value)}
                  />
                ) : (
                  <td>${monthlyRate || productivitySupp.monthly_rate}</td>
                )}
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

export default ProductivityReport
