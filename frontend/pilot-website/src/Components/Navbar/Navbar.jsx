import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import './Navbar.css'

const CustomNavbar = () => {
  const dropdownRef = useRef(null)

  // BUG: Needs a fix to close dropdown by clicking anything outside the dropmenu and also links(working)
  const closeDropdown = () => {
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
