import React, { useState, useEffect } from 'react'
import { Twirl as Hamburger } from 'hamburger-react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import Sidebar from './Sidebar/Sidebar'
import SidebarOverlay from './SideBarOverlay/SidebarOverlay'
import './Navbar.css'

// const API_URL = process.env.REACT_APP_API_URL

const CustomNavbar = () => {
  const location = useLocation()
  // const navigate = useNavigate()

  const [openSideBar, setOpenSideBar] = useState(false)
  const [logout, setLogout] = useState(false)

  const showOpenSideBar = () => {
    setOpenSideBar(!openSideBar)
  }
  const closeSideBar = () => {
    setOpenSideBar(false)
  }

  useEffect(() => {
    if (logout) {
      sessionStorage.removeItem('authToken')
    }
  }, [])

  // const useAuth = async () => {
  //   try {
  //     const response = await fetch(`${API_URL}/auth-me`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
  //       }
  //     })

  //     if (response.ok) {
  //       navigate('/home')
  //       const data = await response.json()
  //       sessionStorage.setItem('user_type', data.details.user_type)
  //     } else {
  //       sessionStorage.removeItem('authToken')
  //       sessionStorage.removeItem('user_type')
  //       navigate('/')
  //     }
  //   } catch (error) {
  //     sessionStorage.removeItem('authToken')
  //     sessionStorage.removeItem('user_type')
  //     navigate('/')
  //   }
  // }

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

          <Navbar.Brand href={sessionStorage.getItem('authToken') !== null ? '/home' : '/#'}>
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
                  <Link
                    to='/'
                    onClick={() => {
                      sessionStorage.removeItem('authToken')
                      setLogout(!logout)
                    }}
                    className='nav-link logout-button'
                  >
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
