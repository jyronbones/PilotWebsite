import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MonthlyCalendar.css";

const localizer = momentLocalizer(moment);

const MonthlyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("Please enter event name");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleEventSelect = (event) => {
    const action = window.prompt("Choose an action: 'edit' or 'delete'");
    if (action === "delete") {
      const newEvents = events.filter((e) => e !== event);
      setEvents(newEvents);
    } else if (action === "edit") {
      const title = window.prompt("Please edit event name", event.title);
      const newEvents = events.map((e) => (e === event ? { ...e, title } : e));
      setEvents(newEvents);
    }
  };

  return (
    <div className="rbc-container">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: "500px" }}
        selectable={true}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
      />
    </div>
  );
};

export default MonthlyCalendar;
