import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './ProductivityReport.css'

const API_URL = process.env.REACT_APP_API_URL

const ProductivityReport = ({ year }) => {
  ProductivityReport.propTypes = {
    year: PropTypes.number.isRequired
  }

  const [availability, setAvailability] = useState(0)
  const [productivity, setProductivity] = useState(0)

  useEffect(() => {
    fetchAvailability()
    fetchProductivity()
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

  const fetchProductivity = async () => {
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
        setProductivity(data.data)
        console.log(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
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
            <td>{productivity.total_assignments}</td>
          </tr>
          <tr>
            <th>Productive Assignments</th>
            <td>
              {productivity.total_assignments - availability.threshold < 0 ? 0 : productivity.total_assignments - availability.threshold}
            </td>
          </tr>
          <tr>
            <th>{`${year} Rate (Daily Rate x 2)`}</th>
            <td>11</td>
          </tr>
          <tr>
            <th>Total Sum Accummulated</th>
            <td>11</td>
          </tr>
          <tr>
            <th>Share Value</th>
            <td>11</td>
          </tr>
        </table>
      </section>
    </div>
  )
}

export default ProductivityReport
