import React from 'react'
import PropTypes from 'prop-types'
import './ProductivityReport.css'

const ProductivityReport = ({ year }) => {
  ProductivityReport.propTypes = {
    year: PropTypes.number.isRequired
  }

  //   useEffect(() => {
  //     fetchUsers()
  //   }, [])

  //   const fetchUsers = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/user`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
  //         }
  //       })

  //       if (response.ok) {
  //         const data = await response.json()
  //         console.log(data.data)
  //       }
  //     } catch (error) {
  //       console.log(error.message)
  //     }
  //   }

  return (
    <div className='table-container'>
      <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
        <table className='prodreport-table'>
          <tr>
            <th>Average number of effective pilots</th>
            <td>11</td>
          </tr>
          <tr>
            <th>Prouctivity Threshold</th>
            <td>11</td>
          </tr>
          <tr>
            <th>Total Number of Assignments</th>
            <td>11</td>
          </tr>
          <tr>
            <th>Productive Assignments</th>
            <td>11</td>
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
