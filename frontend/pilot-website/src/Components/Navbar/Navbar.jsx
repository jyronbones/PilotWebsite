import React, { useState } from 'react'
import { Twirl as Hamburger } from 'hamburger-react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import Sidebar from './Sidebar/Sidebar'
import SidebarOverlay from './SideBarOverlay/SidebarOverlay'
import './Navbar.css'

const CustomNavbar = () => {
  const location = useLocation()
  const [openSideBar, setOpenSideBar] = useState(false)

  const showOpenSideBar = () => {
    setOpenSideBar(!openSideBar)
  }
  const closeSideBar = () => {
    setOpenSideBar(false)
  }

  return (
    <div className='navbar-container'>
      <Navbar bg='light' expand='lg'>
        <div className='navbar-brand'>
          {/* TODO remove this if user is not signed in */}
          <Nav className='ml-auto'>
            {location.pathname !== '/' && (
              <Nav.Item>
                <div className='navbar-hamburger'>
                  <Hamburger rounded size={18} toggle={setOpenSideBar} toggled={openSideBar} distance='sm' />
                </div>
              </Nav.Item>
            )}
          </Nav>

          <Navbar.Brand href='/home'>
            <img src='/images/logo/logo.png' alt='Logo' className='navbar-logo' />
            <div className='navbar-brand-text'>
              <span>Upper St. Lawrence Pilots Association</span>
            </div>
          </Navbar.Brand>
        </div>

        <div className='navbar-logout'>
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
        </div>
      </Navbar>

      {openSideBar ? <Sidebar openSideBar={openSideBar} setOpenSideBar={showOpenSideBar} /> : <></>}
      <SidebarOverlay isOpen={openSideBar} onClose={closeSideBar} />
    </div>
  )
}

export default CustomNavbar
