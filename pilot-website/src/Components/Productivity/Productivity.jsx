import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../navbar/Navbar";

function Productivity() {
  return (
    <div>
      <Navbar></Navbar>
      <h1>Productivity</h1>
      <Link to="/">
        <FaArrowLeft /> Home
      </Link>
    </div>
  );
}

export default Productivity;
