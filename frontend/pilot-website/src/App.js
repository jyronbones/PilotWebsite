import React from 'react'
import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'
import Productivity from './Components/Productivity/Productivity'
import Navbar from './Components/Navbar/Navbar'
import Login from './Components/Login/Login'
import Scheduling from './Components/Scheduling/Scheduling'
import MonthlyCalendar from './Components/Scheduling/MonthlyCalendar/MonthlyCalendar'
import VacationSchedule from './Components/Scheduling/VacationSchedule/VacationSchedule'
import UnionAgreement from './Components/UnionAgreement/UnionAgreement'
import MeetingMinutes from './Components/MeetingMinutes/MeetingMinutes'
import AdminPortal from './Components/AdminPortal/AdminPortal'
import ErrorComponent from './Components/Error/ErrorComponent'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const showFooter = location.pathname !== '/'

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/productivity' element={<Productivity />} />
        <Route path='/meeting-minutes' element={<MeetingMinutes />} />
        <Route path='/scheduling' element={<Scheduling />} />
        <Route path='/monthly-calendar' element={<MonthlyCalendar />} />
        <Route path='/vacation-schedule' element={<VacationSchedule />} />
        <Route path='/union-agreement' element={<UnionAgreement />} />
        <Route path='/admin-panel' element={<AdminPortal />} />
        <Route path='/error/:errorCode' element={<ErrorComponent />} />
        <Route path='*' element={<ErrorComponent errorCode={404} errorMessage='Page not found' />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  )
}

export default App
