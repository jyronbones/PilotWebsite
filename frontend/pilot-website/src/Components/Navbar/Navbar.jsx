import React, { useRef } from 'react' // <-- Added useRef
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import './Navbar.css'

const CustomNavbar = () => {
  const dropdownRef = useRef(null) // <-- Added ref for dropdown

  const closeDropdown = () => {
    // Check if the current is available and close it
    if (dropdownRef.current) {
      dropdownRef.current.toggle()
    }
  }

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

        <NavDropdown title='Features' id='basic-nav-dropdown' ref={dropdownRef}>
          <NavDropdown.Item as={Link} to='/Productivity' onClick={closeDropdown}>
            <h3>Productivity</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/meeting-minutes' onClick={closeDropdown}>
            <h3>Meeting Minutes</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/scheduling' onClick={closeDropdown}>
            <h3>Scheduling</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/klein' onClick={closeDropdown}>
            <h3>KLEIN Login</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/union-agreement' onClick={closeDropdown}>
            <h3>Union Agreement</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/links' onClick={closeDropdown}>
            <h3>Links</h3>
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/admin-panel' onClick={closeDropdown}>
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
