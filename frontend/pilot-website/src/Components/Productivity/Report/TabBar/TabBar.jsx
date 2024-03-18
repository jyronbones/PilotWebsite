import React from 'react'
import PropTypes from 'prop-types'
import './TabBar.css'

const TabBar = ({ tabContent, setActiveTab }) => {
  TabBar.propTypes = {
    tabContent: PropTypes.array.isRequired,
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
          {tabContent.map((tab, key) => (
            <div
              className='tab'
              key={key}
              onClick={() => {
                setActiveTab
                toggleTab(this)
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TabBar
