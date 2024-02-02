import React, { useState, useEffect } from 'react'
import { FaUserShield } from 'react-icons/fa'
import { TbProgressAlert } from 'react-icons/tb'
import Badge from '@material-ui/core/Badge'
import { Link } from 'react-router-dom'
import './Admin.css'

const API_URL = process.env.REACT_APP_API_URL

const Admin = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setList(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div>
      <div className='Admin'>
        <Link to='/admin/people' className='link-admin'>
          <Badge color='primary' badgeContent={list.length} className='icon-admin'>
            <FaUserShield size={40} />
          </Badge>
          <h3>People</h3>
        </Link>

        <Link to='/admin/pending-requests' className='link-admin'>
          <Badge color='secondary' badgeContent={3} className='icon-admin'>
            <TbProgressAlert size={40} />
          </Badge>
          <h3>Pending Requests</h3>
        </Link>

        <Link to='/extra1' className='link-admin'>
          <Badge color='secondary' badgeContent={0} className='icon-admin' overlap='rectangular'>
            <TbProgressAlert size={40} />
          </Badge>
          <h3>Extra 1</h3>
        </Link>

        <Link to='/extra2' className='link-admin'>
          <Badge color='secondary' badgeContent={0} className='icon-admin'>
            <TbProgressAlert size={40} />
          </Badge>
          <h3>Extra 2</h3>
        </Link>
      </div>
    </div>
  )
}

export default Admin
