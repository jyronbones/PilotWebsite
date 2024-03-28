import React from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Productivity from './Components/Productivity/Productivity'
import Navbar from './Components/Navbar/Navbar'
import Login from './Components/Login/Login'
import Scheduling from './Components/Scheduling/Scheduling'
import MonthlyCalendar from './Components/Scheduling/MonthlyCalendar/MonthlyCalendar'
import VacationSchedule from './Components/Scheduling/VacationSchedule/VacationSchedule'
import CollectiveAgreement from './Components/CollectiveAgreement/CollectiveAgreement'
import MeetingMinutes from './Components/MeetingMinutes/MeetingMinutes'
import AdminPortal from './Components/AdminPortal/AdminPortal'

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
        <Route path='/collective-agreement' element={<CollectiveAgreement />} />
        <Route path='/admin-panel' element={<AdminPortal />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  )
}

export default App
