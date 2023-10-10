import React from "react";
import {
  FaProductHunt,
  FaHandshake,
  FaSuitcase,
  FaLink,
  FaCalendarAlt,
  FaClipboard,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="Home">
        <div>
          <Link to="/Productivity">
            <FaProductHunt size={50} className="productivity-icon" />
            <h3 className="productivity-text">Productivity</h3>
          </Link>
        </div>
        <div>
          <Link to="/union-agreement">
            <FaHandshake size={50} className="union-icon" />
            <h3 className="union-text">Union Agreement</h3>
          </Link>
        </div>
        <div>
          <Link to="/vacation-schedule">
            <FaSuitcase size={50} className="vacation-icon" />
            <h3 className="vacation-text">Vacation Schedule</h3>
          </Link>
        </div>
        <div>
          <Link to="/links">
            <FaLink size={50} className="links-icon" />
            <h3 className="links-text">Links</h3>
          </Link>
        </div>
        <div>
          <Link to="/monthly-calendar">
            <FaCalendarAlt size={50} className="calendar-icon" />
            <h3 className="calendar-text">Monthly Calendar</h3>
          </Link>
        </div>
        <div>
          <Link to="/meeting-minutes">
            <FaClipboard size={50} className="minutes-icon" />
            <h3 className="minutes-text">Meeting Minutes</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
