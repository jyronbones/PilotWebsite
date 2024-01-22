import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import './Login.css'

const API_URL = process.env.REACT_APP_API_URL

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        // Store the token securely (for example, in sessionStorage or localStorage)
        sessionStorage.setItem('authToken', data.accessToken)
        sessionStorage.setItem('user_type', data.user_type)
        navigate('/home')
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || 'Login failed: Invalid email or password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('Login error: Please try again later.')
    }
  }

  return (
    <div className='login-container'>
      <div className='header-container'>
        <h2 className='login-title'>Login</h2>
        <div className='logo-wrapper'>
          <img src='/images/logo/textless/logo_textless_bg.png' alt='Company Logo' className='logo-img' />
        </div>
      </div>

      <form className='login-form' onSubmit={handleLogin}>
        {errorMessage && <div className='error-message'>{errorMessage}</div>}
        <div className='input-group'>
          <label htmlFor='email'>Username:</label>
          <input type='email' id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className='input-group'>
          <label htmlFor='password'>Password:</label>
          <div className='password-wrapper'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={`toggle-password ${showPassword ? 'password-shown' : ''}`} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
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
