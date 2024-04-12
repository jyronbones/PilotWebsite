import React, { useState, useRef, useEffect } from 'react'
import { SlClose } from 'react-icons/sl'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { Calendar, Whisper, Popover } from 'rsuite'
// eslint-disable-next-line
import 'rsuite/dist/rsuite.css' // Ensure to import RSuite styles
import 'react-notifications/lib/notifications.css'
import './VacationSchedule.css'
import '../calendar.css'
import moment from 'moment'
import { Link } from 'react-router-dom'

const API_URL = process.env.REACT_APP_API_URL

const VacationSchedule = () => {
  const [events, setEvents] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventRange, setEventRange] = useState({ start: null, end: null })
  const formContainerRef = useRef(null)

  useEffect(() => {
    fetchEmployees()
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/scheduling/employees/`)
      if (response.ok) {
        const employeesData = await response.json()
        const transformedEmployees = employeesData.map((emp) => ({
          ...emp,
          events: emp.events || []
        }))
        setEmployees(transformedEmployees)
        const allEvents = transformedEmployees.flatMap((emp) => emp.events)
        setEvents(allEvents)
      } else {
        console.error('Failed to fetch employees')
        createNotification('warning', 'Failed to fetch employees! ', 'Calendar Status')()
        setEmployees([])
        setEvents([])
      }
    } catch (error) {
      console.error('Error:', error)
      createNotification('error', 'Failed to fetch employees! ', 'Calendar Status')()
      setEmployees([])
      setEvents([])
    }
  }

  const handleClickOutside = (event) => {
    if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
      // setShowForm(false)
      // setSelectedEvent(null)
    }
  }

  const handleSelectSlot = (date) => {
    // Calculate the end date by adding 1 day to the selected date
    const endDate = moment(date).add(1, 'day').startOf('day').toDate()
    // Set the event range with the selected date as the start and the calculated end date
    setEventRange({ start: moment(date).startOf('day').toDate(), end: endDate })
    // Show the form
    setShowForm(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee || !eventRange.start || !eventRange.end || !selectedType) {
      console.error('Missing required information')
      return
    }
    const eventData = {
      start: moment(eventRange.start).format('YYYY-MM-DD'),
      end: moment(eventRange.end).format('YYYY-MM-DD'),
      type: selectedType,
      title: selectedEmployee.name
    }

    try {
      const response = await fetch(`${API_URL}/scheduling/employee-events/${selectedEmployee.employee_id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event: eventData })
      })

      if (response.ok) {
        console.log('Event added successfully')
        createNotification('success', 'Event Submitted!', 'Event Status')()
        await fetchEmployees()
        setShowForm(false)
      } else {
        const errorData = await response.json()
        console.error('Failed to update employee events', errorData)
        createNotification('warning', 'Failed to update employee events! ' + errorData, 'Event Status')()
      }
    } catch (error) {
      console.error('Error:', error)
      createNotification('error', 'Failed to update employee events! ' + error, 'Event Status')()
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedEvent(null)
  }

  function removeEvent(eventToRemove) {
    const eventId = eventToRemove.event_id
    const employeeId = eventId.slice(0, -2) // Remove the last two characters from the event id to make it employee id

    const deleteEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/scheduling/employee-events/${employeeId}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId })
        })

        if (response.ok) {
          console.log('Event removed successfully')
          createNotification('info', 'Event Deleted!', 'Event Status')()
          await fetchEmployees()
        } else {
          console.error('Failed to remove the event')
          createNotification('warning', 'Failed to remove the event', 'Event Status')()
        }
      } catch (error) {
        console.error('Error removing event:', error)
        createNotification('error', 'Error removing event: ' + error, 'Event Status')()
      }
    }

    deleteEvent()
  }

  function getEvents(date) {
    const startOfMonth = moment(date).startOf('month')
    const endOfMonth = moment(date).endOf('month')

    const filteredEvents = events.filter((event) => {
      const eventStartDate = moment(event.start)
      const eventEndDate = moment(event.end)

      // Check if the event overlaps with the current month
      const isEventInMonth =
        (eventStartDate >= startOfMonth && eventStartDate <= endOfMonth) || // Event starts within the month
        (eventEndDate >= startOfMonth && eventEndDate <= endOfMonth) || // Event ends within the month
        (eventStartDate < startOfMonth && eventEndDate > endOfMonth) // Event spans the entire month

      // Check if the event overlaps with the current date
      const isEventOnDay =
        eventStartDate <= date && // Event start date is before or equal to the current date
        eventEndDate.add(1, 'day') >= date // Event end date is after or equal to the current date

      return isEventInMonth && isEventOnDay
    })

    return filteredEvents
  }

  const createNotification = (type, msg, title = null) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info(msg)
          break
        case 'success':
          NotificationManager.success(msg, title)
          break
        case 'warning':
          NotificationManager.warning(msg, title, 3000)
          break
        case 'error':
          NotificationManager.error(msg, title, 5000, () => {
            alert('callback')
          })
          break
      }
    }
  }

  const renderCell = (date) => {
    const list = getEvents(date).filter((item) => item.type === 'vacation' || item.type === 'sick' || item.type === 'floater')
    const displayList = list.slice(0, 2)

    if (list.length) {
      const moreCount = list.length - displayList.length
      const moreItem = (
        <li>
          <Whisper
            placement='auto'
            trigger='hover'
            speaker={
              <Popover>
                {list.map((item, index) => (
                  <p key={index}>
                    <b>{item.title}</b>
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      )

      return (
        <ul className='calendar-event-list'>
          {displayList.map((item, index) => (
            <li key={index}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginLeft: index === 0 ? '5px' : '0' }}>
                  <b>{item.title}</b>
                </div>
                {item.type === 'vacation' && (
                  <div
                    style={{
                      marginLeft: '10px',
                      marginTop: '8px',
                      marginBottom: '10px',
                      backgroundColor: 'orange',
                      height: '10px',
                      borderRadius: '5px',
                      width: '100%' // Adjust this width as per your requirement
                    }}
                  ></div>
                )}
                {item.type === 'sick' && (
                  <div
                    style={{
                      marginLeft: '10px',
                      marginTop: '8px',
                      marginBottom: '10px',
                      backgroundColor: 'yellow',
                      height: '10px',
                      borderRadius: '5px',
                      width: '100%' // Adjust this width as per your requirement
                    }}
                  ></div>
                )}
                {item.type === 'floater' && (
                  <div
                    style={{
                      marginLeft: '10px',
                      marginTop: '8px',
                      marginBottom: '10px',
                      backgroundColor: 'green',
                      height: '10px',
                      borderRadius: '5px',
                      width: '100%' // Adjust this width as per your requirement
                    }}
                  ></div>
                )}
              </div>
            </li>
          ))}
          {moreCount ? moreItem : null}
        </ul>
      )
    }

    return null
  }

  return (
    <div className='content-wrap'>
      <div className='rbc-container'>
        <div className='button-container'>
          <Link to='/scheduling' className='back-btn'>
            Back to Schedules
          </Link>
          <Link to='/monthly-calendar' className='vac-btn'>
            Monthly Scheduling
          </Link>
        </div>
        <h2 className='calendar-title'>Vacation Calendar</h2>
        <div className='calendar-container'>
          <Calendar
            bordered
            style={{ height: '750px', backgroundColor: 'white' }}
            cellClassName={(date) => (date.getDay() % 2 ? 'bg-gray' : undefined)}
            renderCell={renderCell}
            onSelect={(date) => handleSelectSlot(date)} // Pass the event object along with the selected date
          />
        </div>
        {showForm && (
          <div className='form-container' ref={formContainerRef}>
            <div>
              <button
                type='button'
                style={{ top: '25px', backgroundColor: 'transparent', fontSize: '25px' }}
                className='close-button'
                onClick={handleFormCancel}
              >
                <SlClose />
              </button>
            </div>
            {sessionStorage.getItem('user_type') == 1 && (
              <form onSubmit={handleFormSubmit} className='event-form'>
                <h3>{selectedEvent ? 'Edit Event' : 'Add Event'}</h3>

                <div className='input-group'>
                  <label>From Date:</label>
                  <input
                    type='date'
                    value={moment(eventRange.start).format('YYYY-MM-DD')}
                    onChange={(e) => setEventRange({ ...eventRange, start: new Date(e.target.value) })}
                  />
                </div>

                <div className='input-group'>
                  <label>To Date:</label>
                  <input
                    type='date'
                    value={moment(eventRange.end).format('YYYY-MM-DD')}
                    onChange={(e) => setEventRange({ ...eventRange, end: new Date(e.target.value) })}
                  />
                </div>

                <div className='input-group'>
                  <label>Employee:</label>
                  <select
                    value={selectedEmployee ? selectedEmployee.employee_id : ''}
                    onChange={(e) => setSelectedEmployee(employees.find((emp) => emp.employee_id === e.target.value))}
                  >
                    <option value=''>Select Employee</option>
                    {employees?.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.name}
                      </option>
                    )) || []}
                  </select>
                </div>

                <div className='input-group'>
                  <label>Type:</label>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value=''>Select Type</option>
                    <option value='vacation'>Vacation</option>
                    <option value='sick'>Sick</option>
                    <option value='floater'>Floater</option>
                  </select>
                </div>

                <div className='form-buttons'>
                  <button type='submit'>Submit</button>
                  <button type='button' onClick={handleFormCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className='sel-info-box'>
              <h3 style={{ marginBottom: '15px' }}>Schedule Information</h3>
              {events
                .filter(
                  (event) =>
                    (event.type === 'vacation' || event.type === 'sick' || event.type === 'floater') &&
                    (moment(event.start).isSame(eventRange.start, 'day') ||
                      moment(event.end).isSame(eventRange.start, 'day') ||
                      (moment(event.start).isBefore(eventRange.start, 'day') && moment(event.end).isAfter(eventRange.start, 'day')))
                )
                .reduce((result, event, index, array) => {
                  if (index % 2 === 0) {
                    result.push(array.slice(index, index + 2))
                  }
                  return result
                }, [])
                .map((eventPair, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    {eventPair.map((event, idx) => (
                      <div key={idx}>
                        <p>
                          <b>{event.title}</b>
                        </p>
                        <p>
                          <b>Starts:</b> {moment(event.start).format('LL')}
                        </p>
                        <p>
                          <b>Ends:</b> {moment(event.end).format('LL')}
                        </p>
                        <p>
                          <b>Type:</b> {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </p>
                        {sessionStorage.getItem('user_type') == 1 && (
                          <div>
                            <button
                              type='button'
                              style={{ marginTop: '5px', marginBottom: '25px', color: 'white', backgroundColor: 'black' }}
                              onClick={() => removeEvent(event)}
                            >
                              Remove Event
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}
        <NotificationContainer />
      </div>
    </div>
  )
}

export default VacationSchedule
