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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    floaterId: '',
    shiftColor: 'LightBlue', // Default color
    shiftType: 'full-day' // Default type
  })

  const shiftColors = ['LightBlue', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSkyBlue', 'LightYellow']

  const handleSelect = ({ start }) => {
    setSelectedDate(moment(start))
    setShowForm(true)
  }

  const handleFormSubmit = () => {
    const newEvent = {
      start: selectedDate,
      end: selectedDate,
      title: `${formData.firstName} ${formData.lastName}`,
      floaterId: formData.floaterId,
      shiftColor: formData.shiftColor,
      shiftType: formData.shiftType
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

  const handleEditEvent = (event) => {
    // Implement edit functionality as needed
    console.log('Edit event:', event)
  }

  const handleDeleteEvent = () => {
    // Implement delete functionality as needed
    const updatedEvents = events.filter((event) => !moment(event.start).isSame(selectedDate, 'day'))
    setEvents(updatedEvents)
    setShowForm(false)
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
          views={['month']} // Remove 'day' 'week' and 'agenda' views
          events={events}
          style={{ height: '500px' }}
          selectable={true}
          onSelectSlot={handleSelect}
          onSelectEvent={handleEditEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.shiftColor,
              color: 'white'
            }
          })}
        />
        {showForm && (
          <div className='form-container'>
            <div className='event-form'>
              <h3>Add Event for {moment(selectedDate).format('LL')}</h3>
              <label>Date:</label>
              <input type='text' value={moment(selectedDate).format('LL')} readOnly />
              <label>Shift Color:</label>
              <select name='shiftColor' value={formData.shiftColor} onChange={handleInputChange}>
                {shiftColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <label>Shift Type:</label>
              <select name='shiftType' value={formData.shiftType} onChange={handleInputChange}>
                <option value='full-day'>Full Day</option>
                <option value='half-day'>Half Day</option>
                <option value='partial'>Partial</option>
              </select>
              <label>First Name:</label>
              <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} placeholder='First Name' />
              <label>Last Name:</label>
              <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} placeholder='Last Name' />
              <label>Floater ID:</label>
              <input type='text' name='floaterId' value={formData.floaterId} onChange={handleInputChange} placeholder='Floater ID' />
              <div className='form-buttons'>
                <button onClick={handleFormSubmit}>Submit</button>
                <button onClick={handleFormCancel}>Cancel</button>
                <button onClick={handleDeleteEvent}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='selected-info'>
        <h3>Selected Date Information</h3>
        {events
          .filter((event) => moment(event.start).isSame(selectedDate, 'day'))
          .map((event, index) => (
            <div key={index}>
              <p>{event.title}</p>
              <p>Floater ID: {event.floaterId}</p>
              <p>Shift Type: {event.shiftType}</p>
            </div>
          ))}
      </div>
    </div>
  )
}
export default MonthlyCalendar
