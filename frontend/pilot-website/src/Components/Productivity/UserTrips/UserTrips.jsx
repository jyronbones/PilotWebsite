import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TRIP_TYPES } from '../../Constants/constants'
import PropTypes from 'prop-types'
import './UserTrips.css'

const API_URL = process.env.REACT_APP_API_URL

const UserTrip = ({ setCurrUser, currUser, admin, users }) => {
  UserTrip.propTypes = {
    setCurrUser: PropTypes.func.isRequired,
    currUser: PropTypes.object.isRequired,
    admin: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired
  }

  const [trips, setTrips] = useState([])
  const [editUserTrip, setEditUserTrip] = useState({})
  const [isModalOpen, setIsModalOpen] = useState({})
  const [vessel, setVessel] = useState(false)
  const [date, setDate] = useState('')
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [tripType, setTripType] = useState('')
  const [double, setDouble] = useState(false)
  const [notes, setNotes] = useState('')

  const handleClose = () => {
    setVessel(false)
    setDate('')
    setDestination('')
    setDeparture('')
    setTripType('')
    setDouble(false)
    setNotes('')
    setEditUserTrip({})
  }

  const handleSubmit = () => {
    if (Object.keys(editUserTrip).length > 0) {
      updateUserTrip({ vessel, date, departure, destination, tripType, double, notes })
    } else {
      createUserTrip({
        user_id: currUser.id,
        vessel,
        date,
        departure,
        destination,
        tripType,
        double,
        notes
      })
    }
    handleClose()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTrips(data.data)
        setCurrUser(data.data.id)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const createUserTrip = async ({ user_id, vessel, date, departure, destination, tripType, double, notes }) => {
    try {
      const response = await fetch(`${API_URL}/usertrip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ user_id, vessel, date, departure, destination, tripType, double, notes })
      })

      if (response.ok) {
        setEditUserTrip({})
        fetchUsers()
      } else {
        alert('Error')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const updateUserTrip = async ({ vessel, date, departure, destination, tripType, double, notes }) => {
    try {
      const response = await fetch(`${API_URL}/usertrip`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ user_id: editUserTrip.id, vessel, date, departure, destination, tripType, double, notes })
      })

      if (response.ok) {
        setEditUserTrip({})
        fetchUsers()
      } else {
        alert('Error')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/usertrip?trip_id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        fetchUsers()
        alert('User deleted')
      } else {
        const errorMessage = await response.text()
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    setVessel(editUserTrip?.vessel)
    setDate(editUserTrip?.date)
    setDestination(editUserTrip?.destination)
    setDeparture(editUserTrip?.departure)
    setTripType(editUserTrip?.tripType)
    setDouble(editUserTrip?.double)
    setNotes(editUserTrip?.notes)
  }, [editUserTrip])

  const handleTripType = (tripType) => {
    switch (tripType) {
      case 1:
        return 'Full'
      case 2:
        return 'Partial'
      case 3:
        return 'Cancel'
    }
  }

  return (
    <div className='usertrip'>
      <Link to='/home' className='btn back'>
        Back to Home
      </Link>
      <div className='usertrip-container'>
        <div className='usertrip-header'>
          <div className='usertrip-title'>
            <h3>User</h3>
            <select value={currUser} onChange={(e) => setCurrUser(e.target.value)}>
              {users.map((user, key) => (
                <option value='1' key={key}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          {admin.id == currUser.id && (
            <div className='create-btn'>
              <button className='btn create' onClick={() => setIsModalOpen(true)}>
                Add Trip
              </button>
            </div>
          )}

          <div className='usertrip-table-container'>
            <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
              <table className='usertrip-table'>
                <thead>
                  <tr>
                    <th>Vessel Name</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Trip Type</th>
                    <th>Double</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips?.length > 0 ? (
                    <>
                      {trips?.map((trip, index) => (
                        <tr key={index}>
                          <td>{trip?.vessel}</td>
                          <td>{trip?.date}</td>
                          <td>{trip?.departure}</td>
                          <td>{trip?.destination}</td>
                          <td>{handleTripType(trip?.tripType)}</td>
                          <td>{trip?.double ? 'Yes' : 'No'}</td>
                          <td>{trip?.notes}</td>
                          <td>
                            <div className='action-container'>
                              <button
                                className='btn edit'
                                title='Edit User'
                                onClick={() => {
                                  setEditUserTrip(trip)
                                  setIsModalOpen(!isModalOpen)
                                }}
                              >
                                Edit
                              </button>
                              <button className='btn delete' title='Delete User' onClick={() => handleDelete(trip.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
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
      </div>

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='close-button' onClick={handleClose}>
              &times;
            </span>
            <div className='modal-body admin'>
              <label>
                Vessel:
                <input type='text' value={vessel} onChange={(e) => setVessel(e.target.value)} />
              </label>
              <label>
                Date:
                <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label>
                Departure:
                <input type='text' value={departure} onChange={(e) => setDeparture(e.target.value)} />
              </label>
              <label>
                Destination:
                <input type='text' value={destination} onChange={(e) => setDestination(e.target.value)} />
              </label>
              <label>
                Trip Type:
                <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
                  <option disabled selected>
                    Select trip type
                  </option>
                  {TRIP_TYPES.map((tripType, key) => (
                    <option value={key} key={key}>
                      {tripType}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Double:
                <select value={double} onChange={(e) => setDouble(e.target.value)}>
                  <option disabled selected>
                    Select user type
                  </option>
                  <option value='0'>No</option>
                  <option value='1'>Yes</option>
                </select>
              </label>
              <label>
                Notes:
                <input type='text' onChange={(e) => setNotes(e.target.value)} />
              </label>
              <button className='btn create' onClick={handleSubmit}>
                {Object.keys(editUserTrip).length > 0 ? 'Edit' : 'Create'} user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTrip
