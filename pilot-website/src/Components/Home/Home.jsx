import React from "react";
import {
  FaShip,
  FaHandshake,
  FaClock,
  FaLink,
  FaClipboard,
  FaBox,
  FaUserShield,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <Link to="/Productivity" className="link-box">
        <FaShip size={50} className="icon" />
        <h3>Productivity</h3>
      </Link>

      <Link to="/meeting-minutes" className="link-box">
        <FaClipboard size={50} className="icon" />
        <h3>Meeting Minutes</h3>
      </Link>

      <Link to="/scheduling" className="link-box">
        <FaClock size={50} className="icon" />
        <h3>Scheduling</h3>
      </Link>

      <Link to="/klein" className="link-box">
        <FaBox size={50} className="icon" />
        <h3>KLEIN Login</h3>
      </Link>

      <Link to="/union-agreement" className="link-box">
        <FaHandshake size={50} className="icon" />
        <h3>Union Agreement</h3>
      </Link>

      <Link to="/links" className="link-box">
        <FaLink size={50} className="icon" />
        <h3>Links</h3>
      </Link>

      <Link to="/admin-panel" className="link-box">
        <FaUserShield size={50} className="icon" />
        <h3>Admin Panel</h3>
      </Link>
    </div>
  );
};

export default Home;
