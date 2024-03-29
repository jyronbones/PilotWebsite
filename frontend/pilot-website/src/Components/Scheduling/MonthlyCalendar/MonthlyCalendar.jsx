import React, { useState, useRef, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './MonthlyCalendar.css'

const localizer = momentLocalizer(moment)

const API_URL = process.env.REACT_APP_API_URL

const MonthlyCalendar = () => {
  const [events, setEvents] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventRange, setEventRange] = useState({ start: null, end: null })
  const [selectedDate, setSelectedDate] = useState(null)
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
        const data = await response.json()
        const formattedData = data.map((emp) => ({
          ...emp,
          events: emp.events.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            title: event.title || 'No Title' // Add a default title or use one from the event
          }))
        }))
        setEmployees(formattedData)
        // Transform and set events for all employees to be used by the calendar
        const allEvents = formattedData.reduce((acc, curr) => [...acc, ...curr.events], [])
        setEvents(allEvents)
      } else {
        console.error('Failed to fetch employees')
        setEmployees([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEmployees([])
    }
  }

  const handleClickOutside = (event) => {
    if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
      setShowForm(false)
      setSelectedEvent(null)
    }
  }

  const handleSelectSlot = ({ start, end }) => {
    setEventRange({ start: moment(start).toDate(), end: moment(end).toDate() })
    setShowForm(true)
    setSelectedEvent(null)
    setSelectedDate(moment(start).toDate())
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setShowForm(true)
    setSelectedEmployee(employees.find((emp) => emp.id === event.employeeId))
    setEventRange({ start: event.start, end: event.end })
    setSelectedDate(moment(event.start).toDate())
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee || !eventRange.start || !eventRange.end) {
      console.error('Missing required information')
      return
    }

    const event = {
      start: eventRange.start,
      end: eventRange.end,
      title: 'Event' // or any other title you wish to give the event
      // include any other event fields your backend expects
    }

    try {
      const response = await fetch(`${API_URL}/scheduling/update-employee-events/${selectedEmployee.employee_id}/`, {
        method: 'POST', // or 'PUT' if you're updating an existing event
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event }) // adjust based on the expected format
      })

      if (response.ok) {
        fetchEmployees() // Refresh employees and their events after updating
        setShowForm(false)
      } else {
        console.error('Failed to update employee events')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedEvent(null)
  }

  function removeEvent(eventToRemove) {
    setEvents(events.filter((event) => event !== eventToRemove))
    setShowForm(false) // Hide the form after deleting the event
  }

  return (
    <div className='rbc-container'>
      <div className='button-container'>
        <Link to='/scheduling' className='back-btn'>
          Back to Schedules
        </Link>
        <Link to='/vacation-schedule' className='vac-btn'>
          Vacation Scheduling
        </Link>
      </div>
      <h2 className='calendar-title'>Monthly Calendar</h2>
      <div className='calendar-container'>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView='month'
          views={['month']}
          events={events.map((event) => ({ ...event, style: { backgroundColor: event.color } }))}
          style={{ height: '500px' }}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
        {showForm && (
          <div className='form-container' ref={formContainerRef}>
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
              <div className='form-buttons'>
                <button type='submit'>Submit</button>
                <button type='button' onClick={handleFormCancel}>
                  Cancel
                </button>
              </div>
            </form>

            <div className='sel-info-box'>
              <h3>Schedule Information</h3>
              {events
                .filter(
                  (event) =>
                    moment(event.start).isSame(selectedDate, 'day') ||
                    moment(event.end).isSame(selectedDate, 'day') ||
                    (moment(event.start).isBefore(selectedDate, 'day') && moment(event.end).isAfter(selectedDate, 'day'))
                )
                .map((event, index) => (
                  <div key={index}>
                    <p>{event.title}</p>
                    <p>Starts: {moment(event.start).format('LL')}</p>
                    <p>Ends: {moment(event.end).format('LL')}</p>
                    <button type='button' onClick={() => removeEvent(event)}>
                      Remove Employee
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthlyCalendar
