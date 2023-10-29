import React from 'react'
import PropTypes from 'prop-types'
import './SidebarOverlay.css'

const SidebarOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null
  }

  return <div className='sidebar-overlay' onClick={onClose}></div>
}

SidebarOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SidebarOverlay
