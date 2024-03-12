import React, { useState, useRef, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './VacationSchedule.css'

const localizer = momentLocalizer(moment)

const API_URL = process.env.REACT_APP_API_BASE_URL // Fallback to empty if not defined

const VacationSchedule = () => {
  const [events, setEvents] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventRange, setEventRange] = useState({ start: null, end: null })
  const [selectedDate, setSelectedDate] = useState(null)
  const [newEmployeeName, setNewEmployeeName] = useState('')

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
      const response = await fetch(`${API_URL}/api/scheduling/employees/`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setEmployees(data)
        } else {
          console.error('Received unexpected data format:', data)
          setEmployees([]) // Reset to empty array if data is not an array
        }
      } else {
        console.error('Failed to fetch employees')
        setEmployees([]) // Reset to empty array if response is not OK
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Adding new employees to the database
  const addEmployee = async () => {
    try {
      const employeeData = {
        name: newEmployeeName,
        employee_id: generateUniqueEmployeeId().toString()
      }

      const response = await fetch(`${API_URL}/api/sheduling/add-employee/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        fetchEmployees() // Refresh the employees list
        setNewEmployeeName('')
      } else {
        console.error('Failed to add employee:', await response.text())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const renderAddEmployeeForm = () => (
    <form onSubmit={handleAddEmployeeSubmit}>
      <input
        type='text'
        placeholder='New Employee Name'
        value={newEmployeeName}
        onChange={(e) => setNewEmployeeName(e.target.value)}
        required
      />
      <button type='submit'>Add</button>
    </form>
  )

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission behavior

    if (!newEmployeeName.trim()) {
      alert('Please enter a valid name.') // Simple validation
      return
    }

    await addEmployee()
    setNewEmployeeName('') // Reset input field after submission
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (!selectedEmployee) {
      console.error('No employee selected')
      return // Exit the function if no employee is selected
    }

    const newEvent = {
      title: selectedEmployee.name,
      start: eventRange.start,
      end: eventRange.end,
      employee: selectedEmployee,
      color: selectedEmployee.color
    }

    if (selectedEvent) {
      const updatedEvents = events.map((event) => (event === selectedEvent ? newEvent : event))
      setEvents(updatedEvents)
    } else {
      setEvents([...events, newEvent])
    }

    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedEvent(null)
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
    const action = window.prompt("Choose an action: 'edit', 'approve', or 'deny'")
    if (action === 'edit') {
      const title = window.prompt('Please edit vacation details', event.title)
      const newEvents = events.map((e) => (e === event ? { ...e, title } : e))
      setEvents(newEvents)
    } else if (action === 'approve') {
      const newEvents = events.map((e) => (e === event ? { ...e, vacationType: 'Vacation' } : e))
      setEvents(newEvents)
    } else if (action === 'deny') {
      const newEvents = events.map((e) => (e === event ? { ...e, vacationType: 'Sick' } : e))
      setEvents(newEvents)
    }
  }

  // Dummy function to represent generating a unique ID, replace with your actual logic
  function generateUniqueEmployeeId() {
    return Math.floor(Math.random() * 10000).toString()
  }

  return (
    <div className='vacation-container'>
      <div className='button-container'>
        <Link to='/scheduling' className='back-btn'>
          Back to Schedules
        </Link>
        <Link to='/monthly-calendar' className='cal-btn'>
          Monthly Calendar
        </Link>
      </div>
      <h2 className='calendar-title'>Vacation Schedule</h2>
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
            <form onSubmit={handleFormSubmit}>
              <h3>{selectedEvent ? 'Edit Event' : 'Add Event'}</h3>
              <label>From Date:</label>
              <input
                type='date'
                value={moment(eventRange.start).format('YYYY-MM-DD')}
                onChange={(e) => setEventRange({ ...eventRange, start: new Date(e.target.value) })}
              />
              <label>To Date:</label>
              <input
                type='date'
                value={moment(eventRange.end).format('YYYY-MM-DD')}
                onChange={(e) => setEventRange({ ...eventRange, end: new Date(e.target.value) })}
              />
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
              {renderAddEmployeeForm()}
              <div className='form-buttons'>
                <button type='submit'>Submit</button>
                <button type='button' onClick={handleFormCancel}>
                  Cancel
                </button>
              </div>
            </form>
            {selectedEvent && (
              <div className='selected-info'>
                <h3>Schedule Information</h3>
                <p>{selectedEvent.title}</p>
                <p>Date: {moment(selectedEvent.start).format('LL')}</p>
              </div>
            )}
            <div className='sel-info-box'>
              <h3>Schedule Information</h3>
              {events
                .filter((event) => moment(event.start).isSame(selectedDate, 'day'))
                .map((event, index) => (
                  <div key={index}>
                    <list>
                      <ol>
                        <p>{event.title}</p>
                        <p>Starts: {moment(event.start).format('LL')}</p>
                        <p>Ends: {moment(event.end).format('LL')}</p>
                      </ol>
                    </list>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VacationSchedule
