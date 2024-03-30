import React, { useEffect, useState } from 'react'
import { MONTHS } from '../../../Constants/constants'
import './Availability.css'

const API_URL = process.env.REACT_APP_API_URL

const Availability = () => {
  const [users, setUsers] = useState([])
  const [edit, setEdit] = useState(true)
  const [availabilityUpdated, setAvailabilityUpdated] = useState(false)
  const [availability, setAvailability] = useState({})

  useEffect(() => {
    if (availabilityUpdated) fetchUsers()
  }, [availabilityUpdated])

  useEffect(() => {
    if (users.length > 0) {
      const newAvailability = {}
      users.forEach((user) => {
        newAvailability[user.id] = [user.apr, user.may, user.jun, user.jul, user.aug, user.sep, user.oct, user.nov, user.dec]
      })
      setAvailability(newAvailability)
      setAvailabilityUpdated(true)
    }
  }, [users])

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

  const handleCheck = async (user_id, index) => {
    setAvailability((prevAvailability) => {
      const updatedAvailability = {
        ...prevAvailability,
        [user_id]: [
          ...prevAvailability[user_id].slice(0, index), // Copy previous values before index
          !prevAvailability[user_id][index], // Toggle value at index
          ...prevAvailability[user_id].slice(index + 1) // Copy previous values after index
        ]
      }
      return updatedAvailability
    })
  }

  const updateAvailability = async (availability) => {
    try {
      const response = await fetch(`${API_URL}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ availability: availability })
      })
      if (response.ok) {
        fetchUsers()
      } else {
        console.error('Failed to update availability:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const findUser = (id) => {
    const user = users.find((user) => user.id == id)
    if (user) return user.full_name
    else return ''
  }

  return (
    <div>
      <div className='create-btn'>
        <button
          className='btn create'
          onClick={() => {
            if (!edit) updateAvailability(availability)
            setEdit(!edit)
          }}
        >
          {!edit ? 'Done' : 'Edit Table'}
        </button>
      </div>
      <div className='table-container'>
        <section className='availability-container'>
          <div className='availability-table'>
            <div className='availability-header'>
              <div className='availability-cell'>Pilots</div>
              {MONTHS.map((month, key) => (
                <div key={key} className='availability-cell'>
                  {month}
                </div>
              ))}
            </div>
            <div className='availability-body'>
              {users?.length > 0 ? (
                users?.map((user, index) => (
                  <div key={index} className='availability-row'>
                    <div className='availability-cell'>{findUser(user.id)}</div>
                    {availability[user.id] &&
                      MONTHS.map((month, index) => (
                        <div key={index} className='availability-cell'>
                          <input
                            type='checkbox'
                            name={month}
                            checked={availability[user.id][index]}
                            disabled={edit}
                            onChange={() => handleCheck(user.id, index)}
                          />
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <div className='availability-row'>
                  <div className='availability-cell' colSpan={10}>
                    Not found
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Availability
