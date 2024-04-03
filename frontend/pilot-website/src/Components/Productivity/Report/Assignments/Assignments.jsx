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
  const [assignments, setAssignments] = useState([])
  const [users, setUsers] = useState([])
  const [authCorp, setAuthCorp] = useState({})

  useEffect(() => {
    fetchPilotAssignments()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (assignments.length > 0) {
      const newAuthCorp = {}
      assignments.forEach((assignment) => {
        newAuthCorp[assignment.user_id] = assignment.auth_corp
      })
      setAuthCorp(newAuthCorp)
      // setAuthCorpUpdated(true)
    }
  }, [assignments])

  const fetchPilotAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
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
  if (authCorp) console.log(authCorp)

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
      } else {
        console.error('Failed to update availability:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const findUser = (id) => {
    console.log(id)
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
                      {edit ? (
                        <TextField
                          defaultValue={assignment.auth_corp}
                          id='outlined-basic'
                          type='number'
                          label='Auth Corp'
                          variant='outlined'
                          size='small'
                          sx={{
                            width: 100
                          }}
                          onChange={(e) => handleAuthCorp(assignment.user_id, e.target.value)}
                        />
                      ) : (
                        <td>{authCorp[assignment.user_id]}.0</td>
                      )}
                      <td>{assignment?.total}</td>
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
    </div>
  )
}

export default DetailAssignments
