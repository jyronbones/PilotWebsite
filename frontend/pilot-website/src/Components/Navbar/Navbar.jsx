import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import './Navbar.css'

const CustomNavbar = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <div className='navbar-flex-wrapper'>
        <Navbar.Brand href='/home'>
          <img src='/images/logo/logo.png' alt='Logo' className='navbar-logo' />
          <div className='navbar-brand-text'>
            <span>Upper St. Lawrence</span>
            <span>Pilots Association</span>
          </div>
        </Navbar.Brand>

        <NavDropdown title='Features ⌵' id='basic-nav-dropdown'>
          <NavDropdown.Item as={Link} to='/Productivity'>
            <h3>Productivity</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/meeting-minutes'>
            <h3>Meeting Minutes</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/scheduling'>
            <h3>Scheduling</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/klein'>
            <h3>KLEIN Login</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/union-agreement'>
            <h3>Union Agreement</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/links'>
            <h3>Links</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/admin-panel'>
            <h3>Admin Panel</h3>
          </NavDropdown.Item>
        </NavDropdown>
      </div>

      <Navbar.Collapse>
        <Nav className='ml-auto'>
          <Nav.Item>
            <Link to='/' className='nav-link logout-button'>
              Logout
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default CustomNavbar
