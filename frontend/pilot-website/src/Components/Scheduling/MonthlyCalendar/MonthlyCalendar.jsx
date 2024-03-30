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
        setEmployees([])
        setEvents([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEmployees([])
      setEvents([])
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
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setShowForm(true)
    setSelectedEmployee(employees.find((emp) => emp.employee_id === event.employeeId))
    setEventRange({ start: event.start, end: event.end })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee || !eventRange.start || !eventRange.end) {
      console.error('Missing required information')
      return
    }
    const eventData = {
      start: moment(eventRange.start).format('YYYY-MM-DD'),
      end: moment(eventRange.end).format('YYYY-MM-DD'),
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
        await fetchEmployees()
        setShowForm(false)
      } else {
        const errorData = await response.json()
        console.error('Failed to update employee events', errorData)
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
    const eventId = eventToRemove.event_id

    const deleteEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/scheduling/employee-events/${selectedEmployee.employee_id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId })
        })

        if (response.ok) {
          console.log('Event removed successfully')
          await fetchEmployees()
        } else {
          console.error('Failed to remove the event')
        }
      } catch (error) {
        console.error('Error removing event:', error)
      }
    }

    deleteEvent()
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
                    moment(event.start).isSame(eventRange.start, 'day') ||
                    moment(event.end).isSame(eventRange.start, 'day') ||
                    (moment(event.start).isBefore(eventRange.start, 'day') && moment(event.end).isAfter(eventRange.start, 'day'))
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
