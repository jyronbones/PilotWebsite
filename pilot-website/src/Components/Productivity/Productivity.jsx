import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Productivity() {
  return (
    <div>
      <h1>Productivity</h1>
      <Link to="/">
        <FaArrowLeft /> Home
      </Link>
    </div>
  );
}

export default Productivity;
