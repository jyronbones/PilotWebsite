import React from "react";
import { FaSuitcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Scheduling.css";

const Scheduling = () => {
  return (
    <div className="scheduling-container">
      <div>
        <Link to="/monthly-calendar">
          <FaCalendarAlt size={50} className="calendar-icon" />
          <h3 className="calendar-text">Monthly Calendar</h3>
        </Link>
      </div>
      <div>
        <Link to="/vacation-schedule">
          <FaSuitcase size={50} className="vacation-icon" />
          <h3 className="vacation-text">Vacation Schedule</h3>
        </Link>
      </div>
    </div>
  );
};

export default Scheduling;
