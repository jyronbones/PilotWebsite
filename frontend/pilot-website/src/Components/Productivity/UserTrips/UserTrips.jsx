import React, { useState, useEffect } from 'react'
import { TRIP_TYPES, SHIP_CODE } from '../../Constants/constants'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'
import './UserTrips.css'

const API_URL = process.env.REACT_APP_API_URL

const UserTrip = ({ setCurrUser, currUser, admin, users, year }) => {
  UserTrip.propTypes = {
    setCurrUser: PropTypes.func.isRequired,
    currUser: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired
  }

  const [trips, setTrips] = useState([])
  const [editUserTrip, setEditUserTrip] = useState({})
  const [vessel, setVessel] = useState(false)
  const [date, setDate] = useState('')
  const [departure, setDeparture] = useState(0)
  const [destination, setDestination] = useState(0)
  const [tripType, setTripType] = useState(0)
  const [double, setDouble] = useState(false)
  const [notes, setNotes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNoteEnabled, setIsNoteEnabled] = useState(false)
  const [clickClose, setClickClose] = useState(false)

  useEffect(() => {
    if (currUser) fetchUserTrips()
  }, [currUser])

  useEffect(() => {
    setVessel(editUserTrip?.vessel)
    setDate(editUserTrip?.date)
    setDestination(editUserTrip?.destination)
    setDeparture(editUserTrip?.departure)
    setTripType(editUserTrip?.trip_type)
    setDouble(editUserTrip?.double)
    setNotes(editUserTrip?.notes)
  }, [editUserTrip])

  useEffect(() => {
    if (clickClose) {
      setIsModalOpen(false)
    } else if (destination == 10 || departure == 10) {
      setIsModalOpen(true)
      setIsNoteEnabled(true)
    } else if (destination || departure) {
      setIsModalOpen(true)
      setIsNoteEnabled(false)
    } else {
      setIsModalOpen(false)
      setIsNoteEnabled(false)
    }
  }, [destination, departure])

  const fetchUserTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/get-usertrips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ user_id: currUser.id, year })
      })

      if (response.ok) {
        const data = await response.json()
        setTrips(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(editUserTrip).length > 0) {
      console.log(editUserTrip.user_id)
      updateUserTrip({ vessel, date, departure, destination, tripType, double, notes })
    } else {
      await createUserTrip({
        user_id: currUser.id,
        vessel,
        date,
        departure,
        destination,
        tripType,
        double,
        notes
      })
      await updateProd({ user_id: currUser.id })
    }
    handleClose()
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
        fetchUserTrips()
      } else {
        alert('Error')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const updateUserTrip = async ({ vessel, date, departure, destination, tripType, double, notes }) => {
    console.log(editUserTrip.user_id)
    try {
      const response = await fetch(`${API_URL}/usertrip`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          trip_id: editUserTrip.trip_id,
          user_id: editUserTrip.user_id,
          vessel,
          date,
          departure,
          destination,
          tripType,
          double,
          notes
        })
      })

      if (response.ok) {
        setEditUserTrip({})
        fetchUserTrips()
      } else {
        alert('Error')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const updateProd = async ({ user_id }) => {
    try {
      const response = await fetch(`${API_URL}/productivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ user_id, year })
      })

      if (!response.ok) {
        alert('Error')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async (trip_id, user_id) => {
    try {
      const response = await fetch(`${API_URL}/usertrip?trip_id=${trip_id}&user_id=${user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        updateProd({ user_id: currUser.id })
        fetchUserTrips()
      } else {
        const errorMessage = await response.text()
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }

  const handleClose = () => {
    setClickClose(true)
    setVessel(false)
    setDate('')
    setDestination('')
    setDeparture('')
    setTripType('')
    setDouble(false)
    setNotes('')
    setIsModalOpen(false)
    setEditUserTrip({})
  }

  const getOptionLabel = (name) => {
    return name || '' // Return the label property or an empty string if undefined
  }

  return (
    <div className='usertrip-container'>
      <div className='usertrip-header'>
        <h3>User</h3>
        <div>
          <Autocomplete
            className='usertrip dropdown'
            sx={{ width: 200 }}
            size='small'
            value={currUser}
            options={users}
            getOptionLabel={(option) => getOptionLabel(option.full_name)}
            onChange={(e, selectedUser) => setCurrUser(selectedUser)}
            isOptionEqualToValue={(option, value) => option.full_name === value.full_name}
            renderInput={(params) => <TextField {...params} label='Select User' placeholder='User Name' />}
          />
        </div>
      </div>

      <div>
        {currUser && admin.id === currUser.id && (
          <div className='btn actions'>
            <button className='btn create' onClick={() => setIsModalOpen(true)}>
              Add Trip
            </button>
          </div>
        )}

        <div className='table-container'>
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
                        <td>{SHIP_CODE[trip?.departure]}</td>
                        <td>{SHIP_CODE[trip?.destination]}</td>
                        <td>{TRIP_TYPES[trip?.trip_type]}</td>
                        <td>{trip?.double ? 'Yes' : 'No'}</td>
                        <td>{trip?.notes == '' ? 'None' : trip?.notes}</td>
                        <td>
                          <div className='action-container'>
                            {/**************** NOT WORKING *****************
                            <button
                              className='btn edit'
                              title='Edit User'
                              onClick={() => {
                                setEditUserTrip(trip)
                                setIsModalOpen(true)
                              }}
                            >
                              Edit
                            </button>
                            ***************************/}
                            <button className='btn delete' title='Delete User Trip' onClick={() => handleDelete(trip.trip_id, currUser.id)}>
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

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='close-button' onClick={handleClose}>
              &times;
            </span>
            <div className='modal-body admin'>
              <label>
                Vessel:
                <input required type='text' value={vessel} onChange={(e) => setVessel(e.target.value)} />
              </label>
              <label>
                Date:
                <input required type='date' value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label>
                Departure:
                <select
                  required
                  value={departure}
                  onChange={(e) => {
                    setClickClose(false)
                    setDeparture(e.target.value)
                  }}
                >
                  <option disabled selected>
                    Select departure
                  </option>
                  {SHIP_CODE.map((code, key) => (
                    <option value={key} key={key}>
                      {code}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Destination:
                <select
                  required
                  value={destination}
                  onChange={(e) => {
                    setClickClose(false)
                    setDestination(e.target.value)
                  }}
                >
                  <option disabled selected>
                    Select destination
                  </option>
                  {SHIP_CODE.map((code, key) => (
                    <option value={key} key={key}>
                      {code}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trip Type:
                <select required value={tripType} onChange={(e) => setTripType(e.target.value)}>
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
                <select required value={double} onChange={(e) => setDouble(e.target.value)}>
                  <option disabled selected>
                    Select
                  </option>
                  <option value='0'>No</option>
                  <option value='1'>Yes</option>
                </select>
              </label>
              <label className='notes'>
                Notes:
                <input
                  type='text'
                  disabled={!isNoteEnabled}
                  placeholder='Choose "Other" to enable'
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
              <button className='btn create' onClick={handleSubmit}>
                {Object.keys(editUserTrip).length > 0 ? 'Edit' : 'Create'} trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTrip
