import React, { useState, useEffect } from 'react'
import './DetailAssignments.css'
import { DETAIL_ASSIGNMENT } from '../../../Constants/constants'

const API_URL = process.env.REACT_APP_API_URL
const AUTH_CORP = 1.0

const DetailAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchPilotAssignments()
    fetchUsers()
  }, [])

  const fetchPilotAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/productivity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAssignments(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const findUser = (id) => {
    const user = users.find((user) => user.id == id)
    if (user) {
      return user.full_name
    } else {
      return ''
    }
  }

  return (
    <div className='table-container'>
      <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
        <table className='assignment-table'>
          <thead>
            <tr>
              <th>Pilots</th>
              {DETAIL_ASSIGNMENT.map((month, key) => (
                <th key={key}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments?.length > 0 ? (
              <>
                {assignments?.map((assignment, index) => (
                  <tr key={index}>
                    <td>{findUser(assignment.user_id)}</td>
                    <td>{assignment?.total_full}</td>
                    <td>{assignment?.total_partial}</td>
                    <td>{assignment?.total_cancel}</td>
                    <td>{assignment?.total_assignments}</td>
                    <td>{AUTH_CORP}</td>
                    <td>{assignment?.total_assignments + AUTH_CORP}</td>
                    <td>12000</td>
                    <td>{assignment?.total_double}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={9}>Not found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default DetailAssignments
