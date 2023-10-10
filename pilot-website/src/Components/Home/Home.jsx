import React from "react";
import { FaProductHunt, FaHandshake, FaSuitcase } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="Home">
        <h1>Welcome to Pilot Website</h1>
        <div>
          <Link to="/Productivity">
            <FaProductHunt size={50} />
            <h3>Productivity</h3>
          </Link>
        </div>
        <div>
          <Link to="/union-agreement">
            <FaHandshake size={50} />
            <h3>Union Agreement</h3>
          </Link>
        </div>
        <div>
          <Link to="/vacation-schedule">
            <FaSuitcase size={50} />
            <h3>Vacation Schedule</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
