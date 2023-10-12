import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./Navbar.css";

const CustomNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">
        <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
        Upper St. Lawrence Pilots Association
      </Navbar.Brand>
      <Link to="/home" className="nav-link">
        Home
      </Link>
      <Navbar.Collapse>
        <Nav className="ml-auto">
          <Nav.Item>
            <Link to="/" className="nav-link">
              Logout
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
