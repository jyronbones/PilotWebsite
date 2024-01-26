import React from 'react'
import { FaShip, FaHandshake, FaClock, FaLink, FaClipboard, FaBox } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Home.css'
import Admin from '../Admin/Admin'

const Home = () => {
  const isAdmin = true
  return (
    <div>
      {/* <h1 className='admin-title'>Admin</h1> */}
      {isAdmin ? <Admin /> : null}
      {/* <h1 className='dashboard-title'>Dashboard</h1> */}
      <div className={`Home ${isAdmin ? 'active' : ''}`}>
        <Link to='/Productivity' className='link-box'>
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

        <Link to='/klein' className='link-box'>
          <FaBox size={50} className='icon' />
          <h3>KLEIN Login</h3>
        </Link>

        <Link to='/union-agreement' className='link-box'>
          <FaHandshake size={50} className='icon' />
          <h3>Union Agreement</h3>
        </Link>

        <Link to='/links' className='link-box'>
          <FaLink size={50} className='icon' />
          <h3>Links</h3>
        </Link>
      </div>
    </div>
  )
}

export default Home
