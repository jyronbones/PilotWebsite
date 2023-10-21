import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import './Navbar.css'

const CustomNavbar = () => {
  const location = useLocation()

  return (
    <Navbar bg='light' expand='lg'>
      <div className='navbar-flex-wrapper'>
        <Navbar.Brand href='/home'>
          <img src='/images/logo/logo.png' alt='Logo' className='navbar-logo' />
          <div className='navbar-brand-text'>
            <span>Upper St. Lawrence Pilots Association</span>
          </div>
        </Navbar.Brand>
      </div>

      <Navbar.Collapse>
        <Nav className='ml-auto'>
          {location.pathname !== '/' && (
            <Nav.Item>
              <Link to='/' className='nav-link logout-button'>
                Logout
              </Link>
            </Nav.Item>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default CustomNavbar
