import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

afterEach(cleanup)

test('renders Login component', () => {
  render(<App />)
  const loginElement = screen.getByText('Login')
  expect(loginElement).toBeInTheDocument()
})
