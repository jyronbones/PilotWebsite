import React from "react";
import { FaSuitcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Scheduling.css";

const Scheduling = () => {
  return (
    <div className="scheduling-container">
      <div className="link-box">
        <Link to="/monthly-calendar" className="calendar-link">
          <FaCalendarAlt size={50} className="calendar-icon" />
          <h3 className="calendar-text">Monthly Calendar</h3>
        </Link>
      </div>
      <div className="link-box">
        <Link to="/vacation-schedule" className="vacation-link">
          <FaSuitcase size={50} className="vacation-icon" />
          <h3 className="vacation-text">Vacation Schedule</h3>
        </Link>
      </div>
    </div>
  );
};

export default Scheduling;
