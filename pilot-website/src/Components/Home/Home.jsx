import React from "react";
import {
  FaProductHunt,
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
    <div>
      <div className="Home">
        <div>
          <Link to="/Productivity">
            <FaProductHunt size={50} className="productivity-icon" />
            <h3 className="productivity-text">Productivity</h3>
          </Link>
        </div>
        <div>
          <Link to="/meeting-minutes">
            <FaClipboard size={50} className="minutes-icon" />
            <h3 className="minutes-text">Meeting Minutes</h3>
          </Link>
        </div>
        <div>
          <Link to="/scheduling">
            <FaClock size={50} className="scheduling-icon" />
            <h3 className="scheduling-text">Scheduling</h3>
          </Link>
        </div>
        <div>
          <Link to="/klein">
            <FaBox size={50} className="klein-icon" />
            <h3 className="klein-text">KLEIN Login</h3>
          </Link>
        </div>
        <div>
          <Link to="/union-agreement">
            <FaHandshake size={50} className="union-icon" />
            <h3 className="union-text">Union Agreement</h3>
          </Link>
        </div>
        <div>
          <Link to="/links">
            <FaLink size={50} className="links-icon" />
            <h3 className="links-text">Links</h3>
          </Link>
        </div>
        <div>
          {/* Placeholder check for admin. When admin functionality is implemented, you can wrap the Link component with a conditional rendering based on the admin status. */}
          <Link to="/admin-panel">
            <FaUserShield size={50} className="admin-icon" />
            <h3 className="admin-text">Admin Panel</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
