import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './MonthlyCalendar.css'

const localizer = momentLocalizer(moment)

const MonthlyCalendar = () => {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', floaterId: '' })

  const handleSelect = ({ start }) => {
    setSelectedDate(start)
    setShowForm(true)
  }

  const handleFormSubmit = () => {
    const newEvent = {
      start: selectedDate,
      end: selectedDate,
      title: `${formData.firstName} ${formData.lastName}`,
      floaterId: formData.floaterId
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

  return (
    <div className='content-wrap'>
      <div className='rbc-container'>
        <Link to='/scheduling' className='back-btn'>
          Back to Schedules
        </Link>
        <h2 className='calendar-title'>Monthly Calendar</h2>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView='month'
          events={events}
          style={{ height: '500px' }}
          selectable={true}
          onSelectSlot={handleSelect}
        />
        {showForm && (
          <div className='event-form'>
            <h3>Add Event for {moment(selectedDate).format('LL')}</h3>
            <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} placeholder='First Name' />
            <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} placeholder='Last Name' />
            <input type='text' name='floaterId' value={formData.floaterId} onChange={handleInputChange} placeholder='Floater ID' />
            <div className='form-buttons'>
              <button onClick={handleFormSubmit}>Submit</button>
              <button onClick={handleFormCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthlyCalendar
