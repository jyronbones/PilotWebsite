import React from 'react'
import PropTypes from 'prop-types'
import './ErrorComponent.css'

const ErrorComponent = ({ errorCode, errorMessage }) => {
  return (
    <div className='error-page'>
      <div className='error-container'>
        <h1>Error {errorCode}</h1>
        <p>{errorMessage}</p>
        <div className='error-actions'>
          <button onClick={() => window.history.back()} className='error-back-button'>
            Go Back
          </button>
          <button onClick={() => (window.location.href = '/')} className='error-home-button'>
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

// Define prop types for ErrorComponent
ErrorComponent.propTypes = {
  errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  errorMessage: PropTypes.string.isRequired
}

export default ErrorComponent
