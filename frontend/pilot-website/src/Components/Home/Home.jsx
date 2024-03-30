import React from 'react'
import { FaShip, FaHandshake, FaClock, FaClipboard, FaUserShield, FaBox } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className='content-wrap'>
      <div className='Home'>
        <Link to='/productivity' className='link-box'>
          <FaShip size={50} className='icon' />
          <h3>Productivity</h3>
        </Link>

        <Link to='/meeting-minutes' className='link-box'>
          <FaClipboard size={50} className='icon' />
          <h3>Meeting Minutes</h3>
        </Link>

        <Link to='/scheduling' className='link-box'>
          <FaClock size={50} className='icon' />
          <h3>Scheduling</h3>
        </Link>

        <Link to='https://glpms.pilotcontrol.ca/Login.aspx' className='link-box'>
          <FaBox size={50} className='icon' />
          <h3>KLEIN Login</h3>
        </Link>

        <Link to='/collective-agreement' className='link-box'>
          <FaHandshake size={50} className='icon' />
          <h3>Collective Agreement</h3>
        </Link>

        {sessionStorage.getItem('user_type') == 1 && (
          <Link to='/admin-panel' className='link-box'>
            <FaUserShield size={50} className='icon' />
            <h3>Admin Panel</h3>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home
