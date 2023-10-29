import React from 'react'
import { useEffect, useRef } from 'react'

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
          <Link className='sidebar-link' to='/productivity' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Productivity
          </Link>
          <Link className='sidebar-link' to='/meeting-minutes' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Meeting Minutes
          </Link>
          <Link className='sidebar-link' to='/scheduling' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Scheduling
          </Link>
          <Link className='sidebar-link' to='/klein' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Klein Login
          </Link>
          <Link className='sidebar-link' to='/union-agreement' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Union Agreement
          </Link>
          <Link className='sidebar-link' to='/links' onClick={(prevSideBar) => setOpenSideBar(!prevSideBar)}>
            Links
          </Link>
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
