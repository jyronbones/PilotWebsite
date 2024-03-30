import React from 'react'
import PropTypes from 'prop-types'
import './TabBar.css'

const TabBar = ({ tabNames, activeTab, setActiveTab }) => {
  TabBar.propTypes = {
    tabNames: PropTypes.array.isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired
  }

  return (
    <>
      <div className='tab-container'>
        {tabNames.map((tabName, key) => (
          <div key={key} className={`tab-section ${activeTab == tabName ? 'active' : ''}`}>
            <div
              className={`tab ${activeTab == tabName ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tabName)
              }}
            >
              {tabName}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TabBar
