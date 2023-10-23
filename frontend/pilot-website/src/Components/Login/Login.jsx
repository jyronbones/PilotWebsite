import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [isEmail, setIsEmail] = useState(false)
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/home')
  }

  return (
    <div className='login-container'>
      <div className='header-container'>
        <h2 className='login-title'>Login</h2>
        <div className='logo-wrapper'>
          <img src='/images/logo/textless/logo_textless_bg.png' alt='Company Logo' className='logo-img' />
        </div>
      </div>

      <form
        className='login-form'
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <div className='input-group'>
          <label htmlFor='identifier'>{isEmail ? 'Email:' : 'Username:'}</label>
          <input type={isEmail ? 'email' : 'text'} id='identifier' name='identifier' required />
        </div>

        <div className='switch-container'>
          <span className='switch-text' onClick={() => setIsEmail(!isEmail)}>
            Login with {isEmail ? 'Username' : 'Email'}
          </span>
        </div>

        <div className='input-group'>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' name='password' required />
        </div>

        <div className='actions'>
          <button type='submit' className='login-btn'>
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
