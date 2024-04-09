import React, { useEffect, useState } from 'react'
import { MONTHS } from '../../../Constants/constants'
import { PropTypes } from 'prop-types'
import './Availability.css'

const API_URL = process.env.REACT_APP_API_URL

const Availability = ({ year }) => {
  Availability.propTypes = {
    year: PropTypes.number.isRequired
  }
  const [users, setUsers] = useState([])
  const [allAvailability, setAllAvailability] = useState([])
  const [availability, setAvailability] = useState({})
  const [edit, setEdit] = useState(true)
  const [availabilityUpdated, setAvailabilityUpdated] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchAvailability()
  }, [])

  useEffect(() => {
    if (availabilityUpdated) {
      fetchAvailability()
    }
  }, [availabilityUpdated])

  useEffect(() => {
    if (allAvailability.length > 0) {
      const newAvailability = {}
      allAvailability.forEach((availability) => {
        newAvailability[availability.user_id] = [
          availability.apr,
          availability.may,
          availability.jun,
          availability.jul,
          availability.aug,
          availability.sep,
          availability.oct,
          availability.nov,
          availability.dec,
          availability.id
        ]
      })
      setAvailability(newAvailability)
      setAvailabilityUpdated(true)
    }
  }, [allAvailability])

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`${API_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ year })
      })

      if (response.ok) {
        const data = await response.json()
        setAllAvailability(data.data)
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
        const data = await response.json()
        const each_m_effective = data.data
        console.log(each_m_effective)
        fetchAvailability()
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
      <div className='btn actions'>
        {sessionStorage.getItem('user_type') == 1 && (
          <button
            className='btn create'
            onClick={() => {
              if (!edit) updateAvailability(availability)
              setEdit(!edit)
            }}
          >
            {!edit ? 'Done' : 'Edit Table'}
          </button>
        )}
      </div>
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
            {allAvailability?.length > 0 ? (
              allAvailability?.map((item, index) => (
                <div key={index} className='availability-row'>
                  <div className='availability-cell'>{findUser(item.user_id)}</div>
                  {availability[item.user_id] &&
                    MONTHS.map((month, index) => (
                      <div key={index} className='availability-cell'>
                        <input
                          type='checkbox'
                          name={month}
                          checked={availability[item.user_id][index]}
                          disabled={edit}
                          onChange={() => handleCheck(item.user_id, index)}
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
  )
}

export default Availability
