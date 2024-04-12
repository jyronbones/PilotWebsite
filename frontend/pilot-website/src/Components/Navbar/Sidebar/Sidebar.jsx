import React from 'react'
import { useEffect, useRef } from 'react'
import { FaShip, FaHandshake, FaClock, FaClipboard, FaUserShield, FaHome } from 'react-icons/fa'
import { Twirl as Hamburger } from 'hamburger-react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Sidebar.css'

const Sidebar = ({ openSideBar, setOpenSideBar }) => {
  const ref = useRef()

  useEffect(() => {
    const onBodyClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenSideBar(false)
      }
    }

    document.body.addEventListener('click', onBodyClick, { capture: true })

    return () => {
      document.body.removeEventListener('click', onBodyClick, {
        capture: true
      })
    }
  }, [])

  return (
    <div>
      <div ref={ref} className={`sidebar-menu ${openSideBar ? 'active' : ''}`}>
        <div className='sidebar-header'>
          <Link to='/home' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <img src='/images/logo/logo.png' alt='Logo' className='sidebar-logo' />
          </Link>
          <Hamburger toggled={openSideBar} toggle={setOpenSideBar} rounded size={18} distance='md' />
        </div>
        <div className='sidebar-body'>
          <Link className='sidebar-link' to='/home' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <FaHome size={25} className='sidebar-icon' />
            Home
          </Link>
          <Link className='sidebar-link' to='/productivity' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <FaShip size={25} className='sidebar-icon' />
            Productivity
          </Link>
          <Link className='sidebar-link' to='/meeting-minutes' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <FaClipboard size={25} className='sidebar-icon' />
            Meeting Minutes
          </Link>
          <Link className='sidebar-link' to='/scheduling' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <FaClock size={25} className='sidebar-icon' />
            Scheduling
          </Link>
          <Link className='sidebar-link' to='/collective-agreement' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            <FaHandshake size={25} className='sidebar-icon' />
            Collective Agreement
          </Link>
          {sessionStorage.getItem('user_type') == 1 && (
            <Link className='sidebar-link' to='/admin-panel' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
              <FaUserShield size={25} className='sidebar-icon' />
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  openSideBar: PropTypes.bool.isRequired,
  setOpenSideBar: PropTypes.func.isRequired
}

export default Sidebar
