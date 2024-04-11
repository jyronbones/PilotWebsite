import React, { useState, useEffect } from 'react'
import { DETAIL_ASSIGNMENT } from '../../../Constants/constants'
import { PropTypes } from 'prop-types'
import TextField from '@mui/material/TextField'
import './Assignments.css'

const API_URL = process.env.REACT_APP_API_URL

const DetailAssignments = ({ year }) => {
  DetailAssignments.propTypes = {
    year: PropTypes.number.isRequired
  }
  const [edit, setEdit] = useState(false)
  const [allAssignments, setAllAssignments] = useState([])
  const [assignmentSummary, setAssignmentSummary] = useState([])
  const [users, setUsers] = useState([])
  const [authCorp, setAuthCorp] = useState({})

  useEffect(() => {
    fetchPilotAssignments()
    fetchUsers()
    fetchAssignmentSummary()
  }, [])

  useEffect(() => {
    if (allAssignments.length > 0) {
      const newAuthCorp = {}
      allAssignments.forEach((assignment) => {
        newAuthCorp[assignment.user_id] = assignment.auth_corp
      })
      setAuthCorp(newAuthCorp)
    }
  }, [allAssignments])

  const fetchPilotAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/get-allassignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setAllAssignments(data.data)
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

  const handleAuthCorp = async (user_id, authCorp) => {
    setAuthCorp((preAuthCorp) => {
      const updatedAuthCorp = {
        ...preAuthCorp,
        [user_id]: authCorp
      }
      return updatedAuthCorp
    })
  }

  const updateAuthCorp = async (auth_corp) => {
    try {
      const response = await fetch(`${API_URL}/auth-corp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ auth_corp: auth_corp })
      })
      if (response.ok) {
        fetchPilotAssignments()
        fetchAssignmentSummary()
      } else {
        console.error('Failed to update availability:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
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
    <div>
      <div className='btn actions'>
        {sessionStorage.getItem('user_type') == 1 && (
          <button
            className='btn create'
            onClick={() => {
              if (edit) updateAuthCorp(authCorp)
              setEdit(!edit)
            }}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      <div className='table-container'>
        <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
          <table className='assignment-table'>
            <thead>
              <tr>
                <th></th>
                <th>Pilots</th>
                {DETAIL_ASSIGNMENT.map((month, key) => (
                  <th key={key}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allAssignments?.length > 0 ? (
                <>
                  {allAssignments?.map((assignment, index) => (
                    <tr key={index}>
                      <td></td>
                      <td>{findUser(assignment.user_id)}</td>
                      <td>{assignment?.array.total_full}</td>
                      <td>{assignment?.array.total_partial}</td>
                      <td>{assignment?.array.total_cancel}</td>
                      <td>{assignment?.array.total_assignments}</td>
                      {edit ? (
                        <TextField
                          defaultValue={assignment?.array.auth_corp}
                          id='outlined-basic'
                          type='number'
                          label='Auth Corp'
                          variant='outlined'
                          size='small'
                          sx={{
                            width: 100
                          }}
                          onChange={(e) => handleAuthCorp(assignment?.array.user_id, e.target.value)}
                        />
                      ) : (
                        <td>{authCorp[assignment?.array.user_id]}</td>
                      )}
                      <td>{assignment?.array.total}</td>
                      <td>{assignment?.array.amount_shared}</td>
                      <td>{assignment?.array.total_double}</td>
                    </tr>
                  ))}
                  <tr className='total-row'>
                    <td>Total</td>
                    <td></td>
                    <td>{assignmentSummary.total_full}</td>
                    <td>{assignmentSummary.total_partial}</td>
                    <td>{assignmentSummary.total_cancel}</td>
                    <td>{assignmentSummary.total_assignments}</td>
                    <td>{allAssignments.amount_shared || assignmentSummary.auth_corp}</td>
                    <td>{assignmentSummary.total}</td>
                    <td>{assignmentSummary.amount_shared}</td>
                    <td>{assignmentSummary.total_double}</td>
                  </tr>
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
    </div>
  )
}

export default DetailAssignments
