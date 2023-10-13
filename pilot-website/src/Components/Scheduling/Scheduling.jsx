import React from "react";
import { FaSuitcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Scheduling.css";

const Scheduling = () => {
  return (
    <div className="scheduling-container">
      <Link to="/monthly-calendar" className="calendar-link">
        <div className="link-box">
          <FaCalendarAlt size={50} className="calendar-icon" />
          <h3 className="calendar-text">Monthly Calendar</h3>
        </div>
      </Link>
      <Link to="/vacation-schedule" className="vacation-link">
        <div className="link-box">
          <FaSuitcase size={50} className="vacation-icon" />
          <h3 className="vacation-text">Vacation Schedule</h3>
        </div>
      </Link>
    </div>
  );
};

export default Scheduling;
