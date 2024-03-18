import React from 'react'
import PropTypes from 'prop-types'
import './TabBar.css'

const TabBar = ({ setActiveTab }) => {
  TabBar.propTypes = {
    setActiveTab: PropTypes.func.isRequired
  }

  const toggleTab = (tab) => {
    // Remove 'active' class from all tabs
    const tabs = document.querySelectorAll('.tab')
    tabs.forEach((tab) => tab.classList.remove('active'))

    // Add 'active' class to the clicked tab
    tab.classList.add('active')
  }

  return (
    <>
      <div className='tab-container'>
        <div className='tab-section'>
          <div
            className='tab'
            onClick={() => {
              setActiveTab('productivity')
              toggleTab(this)
            }}
          >
            Report
          </div>
          <div
            className='tab'
            onClick={() => {
              setActiveTab('usertrips')
              toggleTab(this)
            }}
          >
            User Trips
          </div>
        </div>
      </div>
    </>
  )
}

export default TabBar
