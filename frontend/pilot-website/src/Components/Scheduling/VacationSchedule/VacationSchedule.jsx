import React, { useState, useRef, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './VacationSchedule.css'

const localizer = momentLocalizer(moment)

const VacationSchedule = () => {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    vacationType: 'Vacation'
  })

  const formContainerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
        setShowForm(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSelect = ({ start }) => {
    setSelectedDate(moment(start))
    setShowForm(true)
  }

  const handleFormSubmit = () => {
    const newEvent = {
      start: selectedDate,
      end: selectedDate,
      title: `${formData.firstName} ${formData.lastName}`,
      vacationType: formData.vacationType
    }

    setEvents([...events, newEvent])
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEventSelect = (event) => {
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

  return (
    <div className='vacation-container'>
      <div className='button-container'>
        <Link to='/scheduling' className='back-btn'>
          Back to Schedules
        </Link>
        <Link to='/monthly-calendar' className='cal-btn'>
          Calendar Scheduling
        </Link>
      </div>
      <h2 className='vacation-title'>Vacation Schedule</h2>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultview='month'
        views={['month']} // Remove 'day' 'week' and 'agenda' views
        events={events}
        style={{ height: '500px' }}
        selectable={true}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
      />
      {showForm && (
        <div className='form-container'>
          <div className='event-form'>
            <h3>Add Vacation for {moment(selectedDate).format('LL')}</h3>
            <label>Date:</label>
            <input type='text' value={moment(selectedDate).format('LL')} readOnly />
            <label>First Name:</label>
            <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} placeholder='First Name' />
            <label>Last Name:</label>
            <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} placeholder='Last Name' />
            <label>Vacation Type:</label>
            <select name='vacationType' value={formData.vacationType} onChange={handleInputChange}>
              <option value='vacation'>Vacation</option>
              <option value='sick'>Sick</option>
              <option value='other'>Other</option>
            </select>
            <div className='form-buttons'>
              <button onClick={handleFormSubmit}>Submit</button>
              <button onClick={handleFormCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className='selected-info'>
        <div className='sel-info-box'>
          <h3>Vacation Information</h3>
          {events
            .filter((event) => moment(event.start).isSame(selectedDate, 'day'))
            .map((event, index) => (
              <div key={index}>
                <p>{event.title}</p>
                <p>Vacation Type: {event.vacationType}</p>
                <p>Date: {moment(event.start).format('LL')}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default VacationSchedule
