import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Link } from "react-router-dom"; // Import Link component
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./VacationSchedule.css";

const localizer = momentLocalizer(moment);

const VacationSchedule = () => {
  const [events, setEvents] = useState([]);

  const handleSelect = ({ start, end }) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const title = window.prompt("Please enter vacation details");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleEventSelect = (event) => {
    // Placeholder for admin check
    // if (!isAdmin) return;

    const action = window.prompt("Choose an action: 'edit' or 'delete'");
    if (action === "delete") {
      const newEvents = events.filter((e) => e !== event);
      setEvents(newEvents);
    } else if (action === "edit") {
      const title = window.prompt("Please edit vacation details", event.title);
      const newEvents = events.map((e) => (e === event ? { ...e, title } : e));
      setEvents(newEvents);
    }
  };

  return (
    <div className="vacation-container">
      <Link to="/scheduling" className="back-btn">
        Back to Schedules
      </Link>{" "}
      {/* Back to Schedules button */}
      <h2 className="vacation-title">Vacation Schedule</h2>
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

export default VacationSchedule;
