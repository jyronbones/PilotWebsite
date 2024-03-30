import React, { useEffect, useState } from 'react'
import TabBar from './TabBar/TabBar'
import Report from './Report/Report'
import UserTrips from './UserTrips/UserTrips'
import { PROD_HEADER } from '../Constants/constants'
import './Productivity.css'

const API_URL = process.env.REACT_APP_API_URL

const Productivity = () => {
  const [activeTab, setActiveTab] = useState('Report')
  const [admin, setAdmin] = useState({})
  const [currUser, setCurrUser] = useState({})
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (sessionStorage.getItem('user_type') == 1) {
      ;(async () => {
        try {
          const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setUsers(data.data)
          }
        } catch (error) {
          console.log(error.message)
        }
      })()
    }
    ;(async () => {
      try {
        const response = await fetch(`${API_URL}/one_user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (sessionStorage.getItem('user_type') == 2) setUsers([data.data])
          setAdmin(data.data)
          setCurrUser(data.data)
        }
      } catch (error) {
        console.log(error.message)
      }
    })()
  }, [])

  return (
    <div className='prod-container'>
      <TabBar setActiveTab={setActiveTab} activeTab={activeTab} tabNames={PROD_HEADER} />
      {activeTab == 'Report' ? <Report /> : <UserTrips setCurrUser={setCurrUser} admin={admin} currUser={currUser} users={users} />}
    </div>
  )
}

export default Productivity
